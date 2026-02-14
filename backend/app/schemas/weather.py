from pydantic import BaseModel
from typing import List


class WeatherResponse(BaseModel):
    temperature: float
    humidity: int
    feels_like: float
    pressure: int
    wind_speed: float
    visibility: int = 0
    description: str
    icon: str
    city: str
    country: str


class ForecastItem(BaseModel):
    datetime: str
    temperature: float
    humidity: int
    description: str
    icon: str
    wind_speed: float


class ForecastResponse(BaseModel):
    city: str
    country: str
    forecasts: List[ForecastItem]
