from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.crop import CropPredictionRequest, CropPredictionResponse
from ..services.ml_service import predict_crop
from ..services.auth_service import get_current_user
from ..models.user import User
from ..models.prediction import PredictionHistory
from ..utils.translations import translate_crop_name

router = APIRouter(prefix="/api/crop", tags=["Crop Recommendation"])


def _do_crop_prediction(data: CropPredictionRequest, lang: str = "en") -> CropPredictionResponse:
    try:
        crop = predict_crop(
            n=data.nitrogen, p=data.phosphorous, k=data.potassium,
            temperature=data.temperature, humidity=data.humidity,
            ph=data.ph, rainfall=data.rainfall,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return CropPredictionResponse(
        crop=translate_crop_name(crop, lang),
        temperature=data.temperature,
        humidity=data.humidity,
        input_data=data.model_dump(),
    )


@router.post("/predict", response_model=CropPredictionResponse)
def crop_prediction(data: CropPredictionRequest, lang: str = Query("en")):
    """Public crop prediction endpoint."""
    return _do_crop_prediction(data, lang)


@router.post("/predict/auth", response_model=CropPredictionResponse)
def crop_prediction_auth(
    data: CropPredictionRequest,
    lang: str = Query("en"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated crop prediction that saves to history."""
    result = _do_crop_prediction(data, lang)
    history = PredictionHistory(
        user_id=current_user.id,
        prediction_type="crop",
        input_data=result.input_data,
        result=result.crop,
    )
    db.add(history)
    db.commit()
    return result
