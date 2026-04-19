# FitAI Monorepo

Full-stack AI-powered fitness calorie prediction app.

```
fitai-monorepo/
├── apps/
│   ├── backend/        ← FastAPI + Random Forest model (Python)
│   └── frontend/       ← Next.js 14 + Coral Athletic UI (TypeScript)
├── package.json
└── README.md
```

## Quick Start

### Backend
```bash
cd apps/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/train.py         # trains model from fittrack_ai_dataset.csv
python run.py                   # starts API at http://localhost:8000
```

### Frontend
```bash
cd apps/frontend
npm install
cp .env.local.example .env.local
# Edit .env.local → set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                     # starts UI at http://localhost:3000
```

## Deployment
- **Backend** → Railway or Render (see `apps/backend/README.md`)
- **Frontend** → Vercel (see `apps/frontend/README.md`)
