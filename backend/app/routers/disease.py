from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.disease import DiseasePredictionResponse
from ..services.ml_service import predict_disease
from ..services.auth_service import get_current_user
from ..models.user import User
from ..models.prediction import PredictionHistory
from ..utils.translations import translate_disease

router = APIRouter(prefix="/api/disease", tags=["Disease Detection"])


def _apply_lang(result: dict, lang: str) -> dict:
    translated = translate_disease(result["prediction_key"], lang)
    if translated:
        result["crop"] = translated.get("crop", result["crop"])
        result["disease"] = translated.get("disease", result["disease"])
        result["cause"] = translated.get("cause", result["cause"])
        result["prevention"] = translated.get("prevention", result["prevention"])
    return result


@router.post("/predict", response_model=DiseasePredictionResponse)
async def disease_prediction(
    file: UploadFile = File(..., description="Plant leaf image"),
    lang: str = Query("en"),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_bytes = await file.read()
        result = predict_disease(image_bytes)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

    return DiseasePredictionResponse(**_apply_lang(result, lang))


@router.post("/predict/auth", response_model=DiseasePredictionResponse)
async def disease_prediction_auth(
    file: UploadFile = File(..., description="Plant leaf image"),
    lang: str = Query("en"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated disease prediction that saves to history."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_bytes = await file.read()
        result = predict_disease(image_bytes)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

    history = PredictionHistory(
        user_id=current_user.id,
        prediction_type="disease",
        input_data={"filename": file.filename},
        result=result["prediction_key"],
    )
    db.add(history)
    db.commit()

    return DiseasePredictionResponse(**_apply_lang(result, lang))
