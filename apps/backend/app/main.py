from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict
from app.config import settings

app = FastAPI(
    title="FitAI Calories Prediction API",
    description="Random Forest model predicting calories burned from workout and biometric data.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "FitAI API is running", "docs": "/docs"}


@app.get("/health", tags=["Health"])
def health():
    from app.services.model_service import model_service
    return {
        "status": "ok",
        "model_loaded": model_service.is_loaded(),
        "model_path": str(model_service.model_path),
    }
