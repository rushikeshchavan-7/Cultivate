# Cultivate 365

AI-powered agricultural decision support system built with **Angular** and **FastAPI**.

## Features

- **Crop Recommendation** — ML-based crop suggestion using soil nutrients (NPK, pH) and weather data
- **Fertilizer Advice** — Smart fertilizer recommendations based on soil analysis and crop requirements
- **Disease Detection** — Plant disease identification from leaf images using ResNet9 deep learning model
- **Weather Dashboard** — Real-time weather data and 5-day forecasts with interactive charts
- **AI Chatbot** — Farming assistant powered by Google Gemini AI
- **User Dashboard** — Track prediction history with charts and analytics
- **Multi-language** — English, Hindi, and Marathi support (i18n)
- **PWA** — Installable as a mobile app with offline support
- **Mobile-First** — Optimized for mobile with bottom navigation and touch-friendly UI
- **JWT Authentication** — Secure user registration and login with refresh tokens

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, Angular Material, Tailwind CSS v4, ng2-charts |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| ML/AI | PyTorch (ResNet9), scikit-learn (RandomForest), Google Gemini |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (python-jose), bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

## Project Structure

```
cultivate-365/
├── backend/                  # FastAPI REST API
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Settings (pydantic-settings)
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models/          # DB models (User, PredictionHistory)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── routers/         # API route modules
│   │   ├── services/        # Business logic layer
│   │   ├── ml_models/       # Trained ML models (.pth, .pkl)
│   │   ├── data/            # CSV data files
│   │   └── utils/           # Utilities (ResNet9, disease/fertilizer data)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # Angular SPA
│   ├── src/app/
│   │   ├── core/            # Services, guards, interceptors
│   │   └── features/        # Feature components (lazy-loaded)
│   ├── src/assets/i18n/     # Translation files (en, hi, mr)
│   └── vercel.json          # Vercel deployment config
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env  # Edit with your API keys

# Run the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install

# Development server
npx ng serve --port 4200
```

App available at: http://localhost:4200

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | JWT signing secret | Yes |
| `WEATHER_API_KEY` | OpenWeatherMap API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No (fallback responses used) |
| `DATABASE_URL` | Database connection string | No (defaults to SQLite) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | JWT login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/profile` | Get current user |
| POST | `/api/crop/predict` | Crop recommendation |
| POST | `/api/fertilizer/predict` | Fertilizer recommendation |
| GET | `/api/fertilizer/crops` | List available crops |
| POST | `/api/disease/predict` | Disease detection (image upload) |
| GET | `/api/weather/{city}` | Current weather |
| GET | `/api/weather/{city}/forecast` | 5-day forecast |
| POST | `/api/chatbot/message` | AI chatbot |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/history` | Prediction history |

## Deployment

### Frontend (Vercel)

```bash
cd frontend
ng build
# Deploy dist/frontend/browser to Vercel
```

### Backend (Render)

1. Push to GitHub
2. Connect repo to Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

## Author

**Rushikesh Chavan** — Built from scratch as a full-stack AI agriculture project.

