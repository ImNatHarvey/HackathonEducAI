# Study Aura n8n Workflows

This folder contains importable n8n workflow JSON files for Study Aura.

## How to import

1. Open n8n at `http://localhost:5678`
2. Create a new workflow
3. Click the three-dot menu
4. Choose **Import from File** or **Import from Clipboard**
5. Import the desired `.json` file
6. Replace placeholder API keys or credentials locally
7. Save and publish the workflow

## Important

Do not commit real API keys inside workflow JSON files.

Use placeholders like:

```txt
YOUR_GEMINI_API_KEY
YOUR_ELEVENLABS_API_KEY
YOUR_SUPABASE_URL
YOUR_SUPABASE_KEY