# Study Aura Local Infrastructure

## 🐳 Docker Orchestration
We use a self-healing Docker Compose stack.

### Automated Workflow Import
We use a dedicated `n8n-import` container that:
1. Waits for n8n to be fully healthy.
2. Automatically injects all `.json` files from `/n8n-workflows` into the database.
3. This ensures that every developer has the exact same AI logic on first boot.

### Internal Networking
- **n8n** talks to **youtube-helper** using the internal DNS name: `http://youtube-helper:8787`.
- This removes the need for `host.docker.internal` and makes the setup compatible with **Linux, macOS, and Windows**.

## 🔧 Environment Synchronization
1. **Master .env**: The root `.env` is the single source of truth.
2. **Setup Script**: `npm run setup` copies relevant variables to `frontend/.env`.
3. **Frontend Vars**: All frontend-facing variables must be prefixed with `VITE_`.

## 🛡️ Team Collaboration
- **Shared Config**: We use a shared Supabase project for the team. 
- **Secrets**: Never commit `.env`. Share it via a secure channel (e.g., Slack/Bitwarden).
- **Updates**: When workflows are updated, export them to `/n8n-workflows`, and they will be auto-imported for the whole team on their next `npm run dev`.
