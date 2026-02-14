from pydantic import BaseModel, Field
from typing import List


class NutrientAnalysis(BaseModel):
    required: int
    provided: int
    difference: int


class FertilizerRequest(BaseModel):
    nitrogen: int = Field(..., ge=0, le=200, description="Nitrogen content in soil")
    phosphorous: int = Field(..., ge=0, le=200, description="Phosphorous content in soil")
    potassium: int = Field(..., ge=0, le=200, description="Potassium content in soil")
    crop_name: str = Field(..., min_length=1, description="Name of the crop")


class FertilizerResponse(BaseModel):
    key: str
    condition: str
    suggestions: List[str]
    analysis: dict
