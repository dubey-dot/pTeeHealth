# Physiofit

AI-powered clinical decision support platform for physiotherapists. This is
phase 1: the **Patient Intake** screen of the clinical Journey, built to
match the Lovable reference design pixel-for-pixel, with a FastAPI backend
serving mocked data behind the same REST contract the real AI/RAG services
will use later.

```
physiofit/
├── backend/     FastAPI app, clean architecture, mocked data
└── frontend/    React + TypeScript + Tailwind, matches the Lovable design
```

## Backend

```bash
cd backend
python3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`. Interactive docs at `/docs`.

Layers (`app/`):
- `api/` — FastAPI routes and dependency wiring (HTTP boundary only)
- `domain/` — framework-agnostic entities (`models/`) and Pydantic
  request/response contracts (`schemas/`)
- `services/` — business/clinical logic, e.g. the red-flag safety check
  that flags an intake for immediate referral
- `infrastructure/` — the mock in-memory repository; swap this for a real
  database-backed repository later without touching services or routes
- `core/` — app-wide config

### Endpoints (v1)

| Method | Path                          | Purpose                                             |
| ------ | ----------------------------- | ---------------------------------------------------- |
| GET    | `/api/v1/intake/options`      | Form vocabulary: factor chips, red flags, genders    |
| POST   | `/api/v1/intake`               | Save a patient intake form                           |
| GET    | `/api/v1/intake`               | List saved intakes                                   |
| GET    | `/api/v1/intake/{id}`          | Fetch one intake                                     |
| POST   | `/api/v1/intake/voice-transcript` | Mock clinical entity extraction from a transcript |
| POST   | `/api/v1/intake/senior-review` | Flag an intake for senior physiotherapist review     |

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` to the backend on port
8000 (see `vite.config.ts`). The intake form renders instantly from local
default options and refreshes from the live API in the background, so the
UI never blocks on the backend being up.

> **Note:** this project was scaffolded in a sandboxed environment without
> package-registry access, so `node_modules` isn't installed yet — run
> `npm install` (frontend) and `pip install -r requirements.txt` (backend)
> on your machine before starting either dev server.

## What's built vs. mocked

- **Built for real:** the full Intake UI (Patient Information, Aggravating/
  Relieving Factors, Red Flags with the critical-flag referral rule), the
  FastAPI layer structure, and the REST contract.
- **Mocked for now:** the form vocabulary (served from static lists rather
  than a config service), the voice-transcript extraction (naive keyword
  match standing in for Amazon Transcribe → Bedrock), and persistence
  (in-memory rather than a real database).
