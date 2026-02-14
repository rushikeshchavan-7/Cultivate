from pydantic import BaseModel
from typing import List
from datetime import datetime


class PredictionHistoryItem(BaseModel):
    id: int
    prediction_type: str
    input_data: dict
    result: str
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    total_predictions: int
    crop_predictions: int
    fertilizer_predictions: int
    disease_predictions: int
    recent_predictions: List[PredictionHistoryItem]


class PredictionHistoryResponse(BaseModel):
    items: List[PredictionHistoryItem]
    total: int
    page: int
    page_size: int
