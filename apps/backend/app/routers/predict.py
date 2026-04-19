from fastapi import APIRouter, HTTPException
from app.schemas import PredictRequest, PredictResponse
from app.services.model_service import model_service
from app.services.prediction_service import run_prediction
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["Prediction"])


@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Predict calories burned",
)
def predict(req: PredictRequest):
    if not model_service.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run scripts/train.py then restart the server.",
        )
    try:
        result = run_prediction(req)
        logger.info(f"Prediction: {result.calories_burned} kcal | fatigue={result.fatigue_score}")
        return result
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))
