from pydantic import BaseModel
from typing import List


class DiseasePredictionResponse(BaseModel):
    prediction_key: str
    crop: str
    disease: str
    cause: str
    prevention: List[str]
