# Resume Modifier

An AI-powered resume tailoring tool. Upload your master experience repository, paste a job description, and get a tailored one-page resume as a downloadable PDF in seconds.

![Resume Modifier](public/favicon.svg)

---

## Why this exists

Sending the same resume to every job is a bad strategy. This tool fixes that.

You keep one master file with everything you've ever done. For each application, you paste the job description. The AI picks what matters, writes bullets that match the role, and packs it all into a single page. No formatting wrestling, no guessing what to include.

---

## Features

- Master repository — download a Markdown template, fill it in, re-upload whenever you want
- Resume parsing — upload your current resume (PDF, DOCX, or TXT) so the AI knows your existing format
- AI generation — NVIDIA NIM, OpenAI, or Anthropic. Switch with one env variable
- Match analysis — see what aligns, what's missing, and what's a stretch before you even look at the resume
- Live PDF preview — renders in the browser
- PDF download — named after you, not a timestamp
- Dark and light mode

---

## Tech stack

| Layer | What |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| AI | NVIDIA NIM / OpenAI / Anthropic (env switch) |
| PDF generation | `@react-pdf/renderer` |
| PDF parsing | `pdfjs-dist` |
| DOCX parsing | `mammoth` |
| File uploads | `multer` |

---

## Prerequisites

- Node.js 18+
- An API key from NVIDIA NIM, OpenAI, or Anthropic

---

## Setup

### 1. Clone

```bash
git clone https://github.com/SoumyaPurani/Resume_modifier.git
cd Resume_modifier
```

### 2. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 3. Set up environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` for your provider.

**NVIDIA NIM** (free, good for trying it out):
```env
AI_PROVIDER = openai
AI_API_KEY = nvapi-...
AI_BASE_URL = https://integrate.api.nvidia.com/v1
AI_MODEL_NAME = meta/llama-3.1-70b-instruct
```
Get a key at [build.nvidia.com](https://build.nvidia.com). Browse models at [catalog.ngc.nvidia.com](https://catalog.ngc.nvidia.com).

**OpenAI**:
```env
AI_PROVIDER = openai
AI_API_KEY = sk-...
AI_BASE_URL = https://api.openai.com/v1
AI_MODEL_NAME = gpt-4o-mini
```

**Anthropic**:
```env
AI_PROVIDER = anthropic
AI_API_KEY = sk-ant-...
AI_MODEL_NAME = claude-opus-4-5
```
No `AI_BASE_URL` needed — the SDK handles it. Get a key at [console.anthropic.com](https://console.anthropic.com). Models: `claude-opus-4-5`, `claude-sonnet-4-5`, `claude-haiku-4-5`.

**Other OpenAI-compatible providers**: set `AI_PROVIDER = openai` and point `AI_BASE_URL` at your endpoint.

### 4. Fill your master repository

First launch serves a template. From the UI:

1. Hit Download in the Master Repository panel
2. Open the `.md` file and write in every job, project, skill, and certification you have
3. Upload it back

Your data lives at `server/data/master-repo.md`, which is gitignored.

---

## Running it

From the project root:

```bash
npm run dev:all
```

Or split across two terminals:

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## How to use

1. Upload your master `.md` if you haven't. The badge flips to `LOADED` when it's active.
2. Optionally upload your current resume (PDF, DOCX, TXT). Gives the AI more context. Skip it and the AI works from the master repo alone.
3. Paste the job description. Include role title, requirements, responsibilities — the more detail, the better the output.
4. Click Generate. The AI figures out what the role actually needs, maps your experience to it, and fills the page.
5. Check the match analysis first. It tells you what fits, what's missing, and what's a reach.
6. Download the PDF.

---

## Project structure

```
resume-modifier/
├── src/
│   ├── Components/
│   │   ├── Header.jsx
│   │   ├── MasterRepo.jsx
│   │   ├── FileUpload.jsx
│   │   ├── JobDescription.jsx
│   │   ├── ResumeDocument.jsx
│   │   └── ResumePreview.jsx
│   ├── Pages/
│   │   └── Home.jsx
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── env.js
│   ├── index.js
│   ├── routes/
│   │   ├── MasterRepo.js
│   │   ├── Parse.js
│   │   └── Generate.js
│   ├── services/
│   │   ├── ai.js
│   │   └── prompt.js
│   ├── data/
│   │   ├── master-repo.md
│   │   └── master-repo.template.md
│   ├── .env
│   └── .env.example
├── public/
│   └── favicon.svg
├── package.json
└── vite.config.js
```

---

## API

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/master-repo` | Fetch master repository |
| `POST` | `/api/master-repo` | Replace master repository |
| `POST` | `/api/parse-resume` | Parse uploaded resume to text |
| `POST` | `/api/generate-resume` | Generate tailored resume |

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `PORT` | No | Defaults to `3001` |
| `AI_PROVIDER` | No | `openai` (default) or `anthropic` |
| `AI_API_KEY` | Yes | Your provider's API key |
| `AI_BASE_URL` | OpenAI only | Not used for Anthropic |
| `AI_MODEL_NAME` | Yes | e.g. `claude-opus-4-5`, `gpt-4o-mini`, `meta/llama-3.1-70b-instruct` |

---

## Security

- Your API key stays in `server/.env` — gitignored, never reaches the browser or version control
- The frontend only talks to your local Express server, never to the AI provider directly
- `master-repo.md` (your personal data) is gitignored too
- Run `git status` before pushing. Every time.

---

## Tweaking the AI output

The system prompt is in `server/services/prompt.js`. It's a plain string — edit it directly, no code changes needed.

You can change:
- Bullet point style (outcome-first, STAR, etc.)
- Which sections the AI prioritises
- How aggressively it fills the page with extra projects
- Skill categories
