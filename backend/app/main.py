import traceback
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, crop, fertilizer, disease, weather, chatbot, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and load ML models
    Base.metadata.create_all(bind=engine)
    from .services.ml_service import load_models
    load_models()
    yield
    # Shutdown


app = FastAPI(
    title="Cultivate 365 API",
    description="Agricultural Decision Support System with Crop Recommendation, Fertilizer Suggestion & Plant Disease Detection",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(crop.router)
app.include_router(fertilizer.router)
app.include_router(disease.router)
app.include_router(weather.router)
app.include_router(chatbot.router)
app.include_router(dashboard.router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print(f"\n{'='*60}\nERROR on {request.method} {request.url}\n{tb}\n{'='*60}\n", flush=True)
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "healthy", "app": "Cultivate 365", "version": "2.0.0"}
