import { useMemo, useState } from "react";
import {
  generateAudioOverviewWithN8n,
  generateFlashcardsWithN8n,
  generateMindMapWithN8n,
  generateQuizWithN8n,
  generateSlidesWithN8n,
  generateTablesWithN8n,
  type AudioOverviewLength,
  type FlashcardDifficulty,
  type MindMapDifficulty,
  type QuizDifficulty,
  type SlidesDifficulty,
  type StudyTableType,
  type TableDifficulty,
} from "../lib/n8n";
import { createGeneratedOutput } from "../services/generatedOutputService";
import type {
  AIToolName,
  StudySource,
} from "../components/dashboard/dashboardTypes";

type UseAIToolActionsParams = {
  topic: string;
  moduleId?: string;
  userId?: string;
  selectedSources: StudySource[];
};

export type AIToolGenerationOptions = {
  difficulty: QuizDifficulty;
  tableType: StudyTableType;
  audioLength: AudioOverviewLength;
};

type ToolStatus = "idle" | "loading" | "success" | "error";

const generationDefaults = {
  quiz: {
    easy: 10,
    medium: 20,
    hard: 30,
  },
  flashcards: {
    easy: 10,
    medium: 15,
    hard: 20,
  },
  tables: {
    easy: 5,
    medium: 8,
    hard: 10,
  },
  mindMap: {
    easy: 4,
    medium: 6,
    hard: 8,
  },
  slides: {
    easy: 5,
    medium: 8,
    hard: 10,
  },
  audio: {
    short: "3–5 segments",
    standard: "5–7 segments",
    deep: "7–10 segments",
  },
} as const;

const stopBrowserSpeech = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

const getOutputTitle = ({
  toolName,
  topic,
}: {
  toolName: AIToolName;
  topic: string;
}) => {
  const timestamp = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return `${toolName} • ${topic} • ${timestamp}`;
};

const getFriendlyToolError = (error: unknown) => {
  const rawMessage =
    error instanceof Error
      ? error.message
      : "Failed to generate AI tool output.";

  const normalizedMessage = rawMessage.toLowerCase();

  if (
    normalizedMessage.includes("503") ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("overloaded")
  ) {
    return "The AI model is temporarily under high demand. Please try again shortly or switch to another tool.";
  }

  if (
    normalizedMessage.includes("timeout") ||
    normalizedMessage.includes("timed out")
  ) {
    return "The AI generation workflow timed out. Please try again.";
  }

  if (
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("failed to fetch")
  ) {
    return "Network connection failed. Please check n8n and try again.";
  }

  if (
    normalizedMessage.includes("webhook") ||
    normalizedMessage.includes("not found")
  ) {
    return "The n8n webhook for this tool may not be active. Please check the workflow and try again.";
  }

  return rawMessage;
};

export const useAIToolActions = ({
  topic,
  moduleId,
  userId,
  selectedSources,
}: UseAIToolActionsParams) => {
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [savedOutputId, setSavedOutputId] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState("");

  const selectedSourcePayload = useMemo(() => {
    return selectedSources.map((source) => ({
      id: source.id,
      title: source.title,
      type: source.type,
      sourceType: source.type,
      value: source.value,
      summary: source.summary,
    }));
  }, [selectedSources]);

  const runTool = async (
    toolName: AIToolName,
    options: AIToolGenerationOptions,
  ) => {
    stopBrowserSpeech();

    setStatus("loading");
    setError("");
    setResult(null);
    setSavedOutputId(null);
    setSaveNotice("");

    try {
      let response: unknown = null;

      if (toolName === "Quiz") {
        response = await generateQuizWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies QuizDifficulty,
          questionCount: generationDefaults.quiz[options.difficulty],
          userId,
        });
      }

      if (toolName === "Cards") {
        response = await generateFlashcardsWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies FlashcardDifficulty,
          cardCount: generationDefaults.flashcards[options.difficulty],
          userId,
        });
      }

      if (toolName === "Tables") {
        response = await generateTablesWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies TableDifficulty,
          tableType: options.tableType,
          rowCount: generationDefaults.tables[options.difficulty],
          userId,
        });
      }

      if (toolName === "Mind Map") {
        response = await generateMindMapWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies MindMapDifficulty,
          branchCount: generationDefaults.mindMap[options.difficulty],
          userId,
        });
      }

      if (toolName === "Slides") {
        response = await generateSlidesWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies SlidesDifficulty,
          slideCount: generationDefaults.slides[options.difficulty],
          userId,
        });
      }

      if (toolName === "Audio") {
        response = await generateAudioOverviewWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          length: options.audioLength,
          userId,
        });
      }

      if (!response) {
        throw new Error("No AI tool response was returned.");
      }

      setResult(response);
      setStatus("success");

      if (userId && moduleId) {
        const savedOutput = await createGeneratedOutput({
          userId,
          moduleId,
          toolName,
          title: getOutputTitle({
            toolName,
            topic,
          }),
          payload: {
            toolName,
            topic,
            options,
            selectedSources: selectedSourcePayload,
            result: response,
          },
        });

        setSavedOutputId(savedOutput.id);
        setSaveNotice("Saved to this module.");
      } else {
        setSaveNotice("Generated output is shown here, but was not saved.");
      }
    } catch (toolError) {
      stopBrowserSpeech();
      setStatus("error");
      setError(getFriendlyToolError(toolError));
    }
  };

  const resetTool = () => {
    stopBrowserSpeech();

    setStatus("idle");
    setError("");
    setResult(null);
    setSavedOutputId(null);
    setSaveNotice("");
  };

  const getLockedCountLabel = (
    toolName: AIToolName,
    difficulty: QuizDifficulty,
    audioLength: AudioOverviewLength = "standard",
  ) => {
    if (toolName === "Quiz") {
      return `${generationDefaults.quiz[difficulty]} questions`;
    }

    if (toolName === "Cards") {
      return `${generationDefaults.flashcards[difficulty]} cards`;
    }

    if (toolName === "Tables") {
      return `${generationDefaults.tables[difficulty]} rows`;
    }

    if (toolName === "Mind Map") {
      return `${generationDefaults.mindMap[difficulty]} branches`;
    }

    if (toolName === "Slides") {
      return `${generationDefaults.slides[difficulty]} slides`;
    }

    if (toolName === "Audio") {
      return generationDefaults.audio[audioLength];
    }

    return "Based on selected sources";
  };

  return {
    status,
    error,
    result,
    savedOutputId,
    saveNotice,
    runTool,
    resetTool,
    getLockedCountLabel,
  };
};