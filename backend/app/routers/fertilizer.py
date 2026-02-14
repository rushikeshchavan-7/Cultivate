from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.fertilizer import FertilizerRequest, FertilizerResponse
from ..services.ml_service import predict_fertilizer
from ..services.auth_service import get_current_user
from ..models.user import User
from ..models.prediction import PredictionHistory
from ..utils.translations import translate_fertilizer, translate_crop_name

router = APIRouter(prefix="/api/fertilizer", tags=["Fertilizer Recommendation"])

AVAILABLE_CROPS = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans",
    "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango",
    "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya",
    "coconut", "cotton", "jute", "coffee",
]


@router.get("/crops")
def get_available_crops(lang: str = Query("en")):
    """Get list of available crops for fertilizer recommendation."""
    crops = [translate_crop_name(c, lang) for c in AVAILABLE_CROPS]
    return {"crops": AVAILABLE_CROPS, "display_names": crops}


def _apply_lang(result: dict, lang: str) -> dict:
    translated = translate_fertilizer(result["key"], lang)
    if translated:
        result["condition"] = translated["condition"]
        result["suggestions"] = translated["suggestions"]
    return result


@router.post("/predict", response_model=FertilizerResponse)
def fertilizer_prediction(data: FertilizerRequest, lang: str = Query("en")):
    """Public fertilizer prediction endpoint."""
    try:
        result = predict_fertilizer(
            crop_name=data.crop_name,
            n=data.nitrogen, p=data.phosphorous, k=data.potassium,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return FertilizerResponse(**_apply_lang(result, lang))


@router.post("/predict/auth", response_model=FertilizerResponse)
def fertilizer_prediction_auth(
    data: FertilizerRequest,
    lang: str = Query("en"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated fertilizer prediction that saves to history."""
    try:
        result = predict_fertilizer(
            crop_name=data.crop_name,
            n=data.nitrogen, p=data.phosphorous, k=data.potassium,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    history = PredictionHistory(
        user_id=current_user.id,
        prediction_type="fertilizer",
        input_data=data.model_dump(),
        result=result["key"],
    )
    db.add(history)
    db.commit()
    return FertilizerResponse(**_apply_lang(result, lang))
