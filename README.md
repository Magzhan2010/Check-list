# CheckList · Frontend

Simple React + TailwindCSS + JavaScript frontend for your FastAPI task management backend. Built with **Vite**, charts powered by **Recharts**.

## Features

- **Light, calm UI** — white cards on slate background, solid colors, no gradients
- **4 overview cards** — Total / Completed / Remaining / Completion Rate
- **3 charts** — category donut, priority bars, completion radial gauge
- **Productive Day banner** — celebrates when you cross 50% (and 100%)
- **Full CRUD** wired to your FastAPI endpoints
- **Optimistic toggle** for marking tasks complete
- **Smart filters** — search, status, priority, and sort
- **Edit & Delete modals**, **toast notifications**, **loading skeletons**, **empty states**
- **Fully responsive** mobile → desktop

## Project structure

```
checklist-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .env.example
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/tasks.js
    ├── hooks/useToast.js
    ├── utils/format.js
    └── components/
        ├── Header.jsx
        ├── StatsOverview.jsx
        ├── ProductiveDayBanner.jsx
        ├── ChartsSection.jsx
        ├── TaskForm.jsx
        ├── EditTaskModal.jsx
        ├── DeleteConfirmModal.jsx
        ├── TaskList.jsx
        ├── TaskCard.jsx
        ├── ToastContainer.jsx
        ├── EmptyState.jsx
        ├── LoadingState.jsx
        └── ApiErrorBanner.jsx
```

## Run locally

```bash
# 1. Install deps
npm install

# 2. Configure API URL
cp .env.example .env
#   edit .env and set VITE_API_URL to your FastAPI server
#   e.g. VITE_API_URL=http://localhost:8000

# 3. Start dev server
npm run dev
```

Open http://localhost:5173

## Enable CORS on your FastAPI backend

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com/new → import the repo
3. Vercel auto-detects Vite — keep defaults
4. Add environment variable: `VITE_API_URL = https://your-fastapi-server.com`
5. Click **Deploy**
6. Add the new Vercel URL to your backend's CORS `allow_origins`

## Tech stack

| Layer     | Choice           |
|-----------|------------------|
| Framework | React 18         |
| Build     | Vite 5           |
| Styling   | TailwindCSS 3    |
| Charts    | Recharts 2       |
| Icons     | lucide-react     |
| Language  | JavaScript (JSX) |

## API contract (matches your FastAPI)

| Method | Path                     | Body / Result                                                                  |
|--------|--------------------------|--------------------------------------------------------------------------------|
| POST   | `/tasks`                 | `{ title, category, priority }`                                                |
| GET    | `/tasks`                 | `Task[]` (needs `response_model=List[TaskOut]` on backend)                     |
| GET    | `/tasks/{id}`            | `Task`                                                                         |
| PATCH  | `/tasks/{id}/complete`   | `{ completed }`                                                                |
| PUT    | `/tasks/{id}`            | `{ title, category, priority }`                                                |
| DELETE | `/tasks/{id}`            | —                                                                              |
| GET    | `/statistics`            | `{ total_tasks, completed_tasks, remaining_tasks, completion_rate }`           |
| GET    | `/statistics/category`   | `[{ category, total }]`                                                        |
