# Resume Modifier

An AI-powered resume tailoring tool. Upload your master experience repository, paste a job description, and get a tailored one-page resume as a downloadable PDF — in seconds.

![Resume Modifier](public/favicon.svg)

---

## What It Does

Most people maintain one generic resume and send it everywhere. This tool takes a different approach:

1. You maintain a **master repository** — a single Markdown file containing every job, project, skill, and certification you have ever accumulated, with no length limit
2. For each application, you paste the **job description**
3. The AI reads both, selects the most relevant content, writes tailored bullet points, and produces a **one-page PDF resume** matched to that specific role

The result is a resume that speaks directly to each job rather than a one-size-fits-all document.

---

## Features

- **Master Repository** — download a Markdown template, fill in your complete experience history, re-upload at any time
- **Resume Parsing** — upload your current resume (PDF, DOCX, or TXT) to give the AI additional context about your style and existing format
- **AI Generation** — powered by any OpenAI-compatible API (NVIDIA NIM by default); constructs a tailored, dense, single-page resume
- **Match Analysis** — before showing the resume, displays strong matches, gaps, and stretch areas between your background and the role
- **Live PDF Preview** — the generated resume renders inline in the browser
- **PDF Download** — one-click download named after the candidate
- **Dark / Light Mode** — full theme toggle

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| AI | NVIDIA NIM, OpenAI, Anthropic (switchable via env) |
| PDF Generation | `@react-pdf/renderer` |
| PDF Parsing | `pdfjs-dist` |
| DOCX Parsing | `mammoth` |
| File Uploads | `multer` |

---

## Prerequisites

- Node.js v18 or higher
- An API key from one of the supported providers:
  - **NVIDIA NIM** (free tier available): [build.nvidia.com](https://build.nvidia.com)
  - **OpenAI**: [platform.openai.com](https://platform.openai.com)
  - **Anthropic**: [console.anthropic.com](https://console.anthropic.com)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/SoumyaPurani/resume-modifier.git
cd resume-modifier
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in the values for your chosen provider.

---

**NVIDIA NIM** (free tier, recommended for getting started)
```env
AI_PROVIDER   = openai
AI_API_KEY    = nvapi-...
AI_BASE_URL   = https://integrate.api.nvidia.com/v1
AI_MODEL_NAME = meta/llama-3.1-70b-instruct
```
1. Create a free account at [build.nvidia.com](https://build.nvidia.com)
2. Navigate to any model page and click **Get API Key**
3. Browse models at [catalog.ngc.nvidia.com](https://catalog.ngc.nvidia.com) — use any chat model's ID

---

**OpenAI**
```env
AI_PROVIDER   = openai
AI_API_KEY    = sk-...
AI_BASE_URL   = https://api.openai.com/v1
AI_MODEL_NAME = gpt-4o-mini
```

---

**Anthropic**
```env
AI_PROVIDER   = anthropic
AI_API_KEY    = sk-ant-...
AI_MODEL_NAME = claude-opus-4-5
```
`AI_BASE_URL` is not needed for Anthropic — the SDK manages the endpoint.

1. Create an account at [console.anthropic.com](https://console.anthropic.com)
2. Go to **API Keys** and generate a key
3. Available models: `claude-opus-4-5`, `claude-sonnet-4-5`, `claude-haiku-4-5`

---

**Any other OpenAI-compatible provider** — set `AI_PROVIDER = openai` and update `AI_BASE_URL` and `AI_MODEL_NAME` accordingly.

### 5. Set up your master repository

The first time you run the app, a default template will be served. From the UI:

1. Click **Download** in the Master Repository panel
2. Open the downloaded `master-repo.template.md` and fill in your complete experience — every job, project, skill, and certification you have
3. Save it and click **Upload .md** to load it into the app

Your filled master repository is stored at `server/data/master-repo.md` and is gitignored — it never gets committed.

---

## Running the App

From the project root, run both servers simultaneously:

```bash
npm run dev:all
```

Or run them separately in two terminals:

```bash
# Terminal 1 — backend (from project root)
npm run dev:server

# Terminal 2 — frontend (from project root)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to Use

1. **Master Repository** — upload your filled `.md` file if you haven't already. The status badge shows `LOADED` when your personal repository is active.

2. **Current Resume** *(optional)* — upload your existing resume (PDF, DOCX, or TXT). This gives the AI context about your current format and highlights. If skipped, the AI uses the master repository exclusively.

3. **Job Description** — paste the full job posting. Include the role title, requirements, responsibilities, and any company detail you can find. The more context, the better the tailoring.

4. **Generate Resume** — click the button. The AI will:
   - Analyse the role's real requirements
   - Map your experience to those requirements
   - Select the most relevant content from your master repository
   - Fill the page densely with tailored bullet points

5. **Review Match Analysis** — before looking at the resume itself, check the match analysis panel. It shows exactly what aligns, what's missing, and what's a stretch.

6. **Download PDF** — the resume renders as a live preview. Click **Download PDF** to save it.

---

## Project Structure

```
resume-modifier/
├── src/                          # React frontend
│   ├── Components/
│   │   ├── Header.jsx            # App header with theme toggle
│   │   ├── MasterRepo.jsx        # Repository download/upload panel
│   │   ├── FileUpload.jsx        # Resume file upload with parsing
│   │   ├── JobDescription.jsx    # Job description input + generate button
│   │   ├── ResumeDocument.jsx    # @react-pdf/renderer PDF template
│   │   └── ResumePreview.jsx     # PDF viewer, match analysis, download
│   ├── Pages/
│   │   └── Home.jsx              # Main layout, all state management
│   ├── index.css                 # Design system, CSS variables, animations
│   └── main.jsx                  # React entry point
├── server/                       # Node.js Express backend
│   ├── env.js                    # Dotenv loader (must be first import)
│   ├── index.js                  # Express app, middleware, route mounting
│   ├── routes/
│   │   ├── MasterRepo.js         # GET/POST master-repo.md
│   │   ├── Parse.js              # POST resume file → extracted text
│   │   └── Generate.js           # POST job desc + resume → AI JSON
│   ├── services/
│   │   ├── ai.js                 # Provider abstraction — OpenAI + Anthropic
│   │   └── prompt.js             # System prompt with resume rules
│   ├── data/
│   │   ├── master-repo.md        # Your personal repository (gitignored)
│   │   └── master-repo.template.md  # Default template (committed)
│   ├── .env                      # Your secrets (gitignored)
│   └── .env.example              # Template for others to fill in
├── public/
│   └── favicon.svg
├── package.json                  # Frontend dependencies + dev:all script
└── vite.config.js                # Vite config with API proxy
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/master-repo` | Fetch master repository content |
| `POST` | `/api/master-repo` | Upload and replace master repository |
| `POST` | `/api/parse-resume` | Parse uploaded resume file to text |
| `POST` | `/api/generate-resume` | Generate tailored resume via AI |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port for the Express server (default: `3001`) |
| `AI_PROVIDER` | No | `openai` (default) or `anthropic` |
| `AI_API_KEY` | Yes | API key for your chosen provider |
| `AI_BASE_URL` | openai only | Base URL of the API — not used for Anthropic |
| `AI_MODEL_NAME` | Yes | Model ID (e.g. `claude-opus-4-5`, `gpt-4o-mini`, `meta/llama-3.1-70b-instruct`) |

---

## Security Notes

- Your API key lives only in `server/.env` which is gitignored — it never touches the frontend or version control
- The browser talks to your local Express server, not to the AI provider directly
- Your `master-repo.md` (personal data) is also gitignored
- Before pushing to GitHub, always run `git status` to confirm neither file is tracked

---

## Customising the AI Behaviour

The system prompt lives at `server/services/prompt.js`. Edit it to change:

- **Bullet point style** — outcome-first, STAR format, etc.
- **Section priorities** — what the AI emphasises for your target industry
- **Page filling strategy** — how aggressively to fill space with additional projects
- **Skills categorisation** — add or remove skill categories

The prompt is plain text — no code changes required, just editing the string.

---

## License

MIT
