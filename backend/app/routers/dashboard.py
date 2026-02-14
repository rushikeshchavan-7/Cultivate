from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..services.auth_service import get_current_user
from ..models.user import User
from ..models.prediction import PredictionHistory
from ..schemas.dashboard import DashboardStats, PredictionHistoryItem, PredictionHistoryResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get dashboard statistics for the current user."""
    base_query = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)

    total = base_query.count()
    crop_count = base_query.filter(PredictionHistory.prediction_type == "crop").count()
    fertilizer_count = base_query.filter(PredictionHistory.prediction_type == "fertilizer").count()
    disease_count = base_query.filter(PredictionHistory.prediction_type == "disease").count()

    recent = (
        base_query
        .order_by(PredictionHistory.created_at.desc())
        .limit(5)
        .all()
    )

    return DashboardStats(
        total_predictions=total,
        crop_predictions=crop_count,
        fertilizer_predictions=fertilizer_count,
        disease_predictions=disease_count,
        recent_predictions=[PredictionHistoryItem.model_validate(p) for p in recent],
    )


@router.get("/history", response_model=PredictionHistoryResponse)
def get_prediction_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    prediction_type: str | None = Query(None, description="Filter by type: crop, fertilizer, disease"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get paginated prediction history for the current user."""
    query = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)

    if prediction_type:
        query = query.filter(PredictionHistory.prediction_type == prediction_type)

    total = query.count()
    items = (
        query
        .order_by(PredictionHistory.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return PredictionHistoryResponse(
        items=[PredictionHistoryItem.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )
