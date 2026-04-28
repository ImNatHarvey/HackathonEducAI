import "dotenv/config";
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import FormData from "form-data";
import fetch from "node-fetch";

const execFileAsync = promisify(execFile);

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = Number(process.env.PORT || 8787);
const TEMP_DIR = path.resolve(process.cwd(), "tmp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const run = async (command, args) => {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      maxBuffer: 1024 * 1024 * 50,
      windowsHide: true,
    });

    return { stdout, stderr };
  } catch (error) {
    const stdout = error?.stdout ? String(error.stdout) : "";
    const stderr = error?.stderr ? String(error.stderr) : "";
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(
      [message, stdout ? `STDOUT:\n${stdout}` : "", stderr ? `STDERR:\n${stderr}` : ""]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
};

const getVideoId = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }

    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch) return shortsMatch[1];

    return parsed.pathname.split("/").filter(Boolean).pop() || "youtube-video";
  } catch {
    return "youtube-video";
  }
};

const findDownloadedAudio = (outputBase) => {
  const baseName = path.basename(outputBase);

  const files = fs
    .readdirSync(TEMP_DIR)
    .filter((file) => file.startsWith(baseName))
    .map((file) => path.join(TEMP_DIR, file))
    .filter((filePath) => fs.existsSync(filePath));

  const audioFile = files.find((filePath) =>
    [".webm", ".m4a", ".mp3", ".wav", ".opus"].includes(
      path.extname(filePath).toLowerCase(),
    ),
  );

  return audioFile || files[0];
};

const transcribeWithGroq = async (filePath) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY in study-aura-youtube-helper/.env.");
  }

  const form = new FormData();
  form.append("model", "whisper-large-v3-turbo");
  form.append("file", fs.createReadStream(filePath));
  form.append("response_format", "json");

  const response = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || JSON.stringify(data));
  }

  return data.text || "";
};

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "study-aura-youtube-helper",
  });
});

app.post("/transcribe-youtube", async (req, res) => {
  const url = String(req.body?.url || "").trim();

  if (!url) {
    return res.status(400).json({
      status: "failed",
      statusMessage: "Missing YouTube URL.",
      text: "",
      provider: "yt-dlp-groq-whisper",
    });
  }

  const videoId = getVideoId(url).replace(/[^a-zA-Z0-9_-]/g, "");
  const outputBase = path.join(TEMP_DIR, `${Date.now()}-${videoId}`);
  const outputTemplate = `${outputBase}.%(ext)s`;

  try {
    console.log("[Study Aura YouTube Helper] Downloading audio:", url);

    await run("python", [
      "-m",
      "yt_dlp",
      "-f",
      "bestaudio[ext=webm]/bestaudio/best",
      "--no-playlist",
      "--max-filesize",
      "100M",
      "-o",
      outputTemplate,
      url,
    ]);

    const downloaded = findDownloadedAudio(outputBase);

    if (!downloaded || !fs.existsSync(downloaded)) {
      throw new Error("yt-dlp did not create an audio file.");
    }

    console.log("[Study Aura YouTube Helper] Transcribing:", downloaded);

    const text = await transcribeWithGroq(downloaded);

    try {
      fs.unlinkSync(downloaded);
    } catch {
      // Ignore cleanup errors.
    }

    if (!text || text.length < 60) {
      throw new Error("Groq Whisper returned too little transcript text.");
    }

    return res.json({
      status: "ready",
      statusMessage: "YouTube audio transcribed using yt-dlp and Groq Whisper.",
      text,
      provider: "yt-dlp-groq-whisper",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "YouTube audio transcription failed.";

    console.error("[Study Aura YouTube Helper] Failed:", message);

    return res.status(200).json({
      status: "failed",
      statusMessage: message,
      text: "",
      provider: "yt-dlp-groq-whisper-failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Study Aura YouTube helper running on http://localhost:${PORT}`);
});