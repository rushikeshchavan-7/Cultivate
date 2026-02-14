from pydantic import BaseModel, Field


class CropPredictionRequest(BaseModel):
    nitrogen: int = Field(..., ge=0, le=200, description="Nitrogen content in soil")
    phosphorous: int = Field(..., ge=0, le=200, description="Phosphorous content in soil")
    potassium: int = Field(..., ge=0, le=200, description="Potassium content in soil")
    ph: float = Field(..., ge=0, le=14, description="pH value of soil")
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage")


class CropPredictionResponse(BaseModel):
    crop: str
    temperature: float
    humidity: float
    input_data: dict
