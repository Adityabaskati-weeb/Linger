# CampusIQ

CampusIQ is an AI-native campus operating system for students, faculty, and administrators. It brings attendance intelligence, CUIMS-style student services, faculty workflows, admin analytics, announcements, voice study help, and timetable generation into one polished hackathon demo.

## One-Line Pitch

CampusIQ helps a college think, attend, learn, and lead from one role-aware platform.

## Demo Credentials

All demo accounts use password `campusiq123`.

| Role | Email | Portal |
| --- | --- | --- |
| Student | `student@campusiq.edu` | Student Portal |
| Faculty | `faculty@campusiq.edu` | Faculty Portal |
| Admin | `admin@campusiq.edu` | Admin Portal |

Start the demo at `http://localhost:5173`, then choose the correct portal card.

## Feature Snapshot

| Area | What Judges Can See |
| --- | --- |
| Student Portal | Dashboard, attendance graphs, below-75 alerts, forecasting, schedule, profile, services, online test |
| Student Services | Virtual ID card, project file upload, NOC, medical leave, transport, exam details, UPI fee QR, CU LMS links |
| AI Study Agent | Upload PDF/DOCX/TXT, summarize uploaded content, generate quiz cards, voice input, voice output |
| Faculty Portal | Dashboard, P/A attendance marking, subject-specific rosters, leave, materials upload, announcements, profile |
| Admin Portal | Campus health score, faculty attendance, attendance analytics, add/remove students and faculty, departments, timetable |
| Timetable | Conflict-aware generation with faculty, room, day, and consecutive-hour constraints |

## Architecture

```mermaid
flowchart TB
  classDef client fill:#eff6ff,stroke:#2563eb,color:#0f172a,stroke-width:2px
  classDef api fill:#ecfeff,stroke:#0891b2,color:#0f172a,stroke-width:2px
  classDef data fill:#f0fdf4,stroke:#16a34a,color:#0f172a,stroke-width:2px
  classDef ai fill:#fff7ed,stroke:#f97316,color:#0f172a,stroke-width:2px
  classDef secure fill:#fef2f2,stroke:#dc2626,color:#0f172a,stroke-width:2px

  subgraph Browser["Browser Client"]
    Landing["3 Portal Landing<br/>Student | Faculty | Admin"]:::client
    ReactApp["React + Vite + TypeScript"]:::client
    Store["Zustand Auth Store"]:::client
    Voice["Web Speech API<br/>Mic + Speech Output"]:::client
  end

  subgraph Server["Express API"]
    Auth["JWT Auth + Role Guard"]:::secure
    Student["Student Routes"]:::api
    Faculty["Faculty Routes"]:::api
    Admin["Admin Routes"]:::api
    AI["AI Routes + SSE Streaming"]:::api
    Timetable["Timetable Generator"]:::api
  end

  subgraph Data["Demo Data + Persistence Ready"]
    Mock["In-Memory Demo Services"]:::data
    Uploads["Uploaded Materials Text Store"]:::data
    Prisma["Prisma PostgreSQL Schema"]:::data
  end

  subgraph Intelligence["AI Layer"]
    Gemini["Gemini Free-Tier API Path"]:::ai
    Fallback["Local Material-Grounded Fallback"]:::ai
  end

  Landing --> ReactApp
  ReactApp --> Store
  ReactApp --> Voice
  ReactApp --> Auth
  Auth --> Student
  Auth --> Faculty
  Auth --> Admin
  Auth --> AI
  Auth --> Timetable
  Student --> Mock
  Faculty --> Mock
  Admin --> Mock
  AI --> Uploads
  AI --> Gemini
  AI --> Fallback
  Timetable --> Mock
  Mock -. "ready to migrate" .-> Prisma
```

## Key Workflows

```mermaid
flowchart LR
  Login["Choose Portal + Login"] --> Role["Protected Role Dashboard"]
  Role --> Student["Student: attendance risk, services, AI, tests"]
  Role --> Faculty["Faculty: attendance, leave, materials, announcements"]
  Role --> Admin["Admin: analytics, approvals, departments, timetable"]
```

```mermaid
sequenceDiagram
  participant Student
  participant UI as AI Agent UI
  participant API as Express AI Route
  participant Context as Uploaded Material Context
  participant Model as Gemini or Local Fallback

  Student->>UI: Upload course file
  UI->>API: Send file and selected subject
  API->>Context: Extract and store document text
  Student->>UI: Ask for summary or quiz
  UI->>API: POST chat request
  API->>Model: Prompt with uploaded material
  Model-->>API: Stream grounded response
  API-->>UI: SSE tokens
  UI-->>Student: Summary, concept card, quiz card, and voice output
```

## Data Status

CampusIQ now uses a local persistent JSON database for hackathon-safe demo data. The backend creates `apps/backend/data/campusiq.local.json` automatically, so created announcements, uploaded materials, attendance sessions, student leave/NOC/project submissions, and admin add/remove actions can survive server restarts.

Check database status here:

```text
http://localhost:4000/api/database
```

The Prisma schema for PostgreSQL still exists in `apps/backend/prisma/schema.prisma`, so Supabase, Neon, or local Postgres can replace the local JSON adapter later by adding `DATABASE_URL` and wiring the services to Prisma.

This means the demo works immediately without a hosted database bill, while still having a real migration path for production persistence.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| State/UI | Zustand, Framer Motion, Recharts, Lucide, custom UI primitives |
| Backend | Node.js, Express, TypeScript, JWT, bcryptjs, Multer |
| AI | Gemini API free-tier path, Web Speech API, local streaming fallback |
| Data | In-memory demo data now, Prisma/PostgreSQL schema ready |
| Tooling | npm workspaces, shared TypeScript types, smoke tests |

## Local Setup

```bash
npm install
npm run dev
```

Useful URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:4000/api` |
| Database Status | `http://localhost:4000/api/database` |
| Health Check | `http://localhost:4000/health` |

## Optional Environment

Create `apps/backend/.env` only when enabling live database or live AI:

```bash
DATABASE_URL="postgresql://user:password@host:5432/campusiq"
JWT_ACCESS_SECRET="replace-with-a-long-secret"
JWT_REFRESH_SECRET="replace-with-a-long-secret"
GEMINI_API_KEY="your-free-tier-key"
GEMINI_MODEL="gemini-2.5-flash"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

Without these values, the demo still works through local seeded data and AI fallback.

Optional local database override:

```bash
LOCAL_DB_PATH="./data/campusiq.local.json"
```

## Judge Demo Path

1. Open `/`, choose Student Portal, and login.
2. Show attendance graph, below-75 alert, threshold forecast, schedule, and student profile.
3. Open Services to show ID card, project upload, NOC, leave, exam fee QR, CU LMS, and important links.
4. Open Online Test and run the 10-question timed test.
5. Open AI Agent, upload a document, then generate a summary and quiz from that document.
6. Login as Faculty, publish an announcement, upload material, and mark P/A attendance.
7. Login as Admin, show campus health, heatmap axes, faculty attendance, department drilldown, and timetable generation.

## Verification

Run before presenting:

```bash
npm run typecheck
npm run build
npm run test:smoke
```

Latest smoke-test coverage includes login, student profile, services, online test, AI subjects, faculty roster separation, attendance marking, admin analytics, departments, add/remove controls, and timetable generation.

## Why It Stands Out

CampusIQ is not only a dashboard. It is a connected campus loop: faculty upload learning material, students use it inside a voice AI tutor, attendance risk is forecasted before it becomes a problem, and admins get an operating view of the institution.
