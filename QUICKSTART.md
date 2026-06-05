# 🚀 Study Aura Quickstart

Get your AI-powered study environment running in under 5 minutes.

## 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Ensures all backend services run consistently)
- [Node.js](https://nodejs.org/) (To run the frontend and automation scripts)

## 2. Setup
Clone the repository and run the setup command:

```bash
# Windows
setup.bat

# macOS / Linux
chmod +x setup.sh start.sh
./setup.sh
```

This will:
1. Create your `.env` file from the template.
2. Verify Docker is running.
3. Sync environment variables to the frontend.
4. Install all necessary dependencies.

## 3. Configure
Open the newly created `.env` file in the root directory and add your API keys:
- `GEMINI_API_KEY`: Get one from [Google AI Studio](https://aistudio.google.com/).
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: From your [Supabase Project](https://supabase.com/).

## 4. Launch
Start the full stack with one command:

```bash
# Windows
start.bat

# macOS / Linux
./start.sh
```

Open [http://localhost:5173](http://localhost:5173) to start studying!

---

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Re-run the environment setup and sync. |
| `npm run dev` | Start the backend (Docker) and frontend (Vite). |
| `npm run stop` | Shut down all Docker containers. |
| `npm run clean` | Wipe node_modules and temp files for a fresh start. |

## 📁 Architecture Overview
- **Frontend**: React 19 + Vite (Runs locally for fast HMR).
- **n8n**: Workflow engine (Docker).
- **YouTube Helper**: Audio transcription service (Docker + Python + yt-dlp).
- **Qdrant**: Vector database (Docker).
