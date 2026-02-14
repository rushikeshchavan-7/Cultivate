from fastapi import APIRouter, HTTPException, Query
from ..services.weather_service import get_weather, get_forecast
from ..schemas.weather import WeatherResponse, ForecastResponse

router = APIRouter(prefix="/api/weather", tags=["Weather"])


@router.get("/{city}", response_model=WeatherResponse)
def current_weather(city: str, lang: str = Query("en")):
    """Get current weather data for a city."""
    weather = get_weather(city, lang)
    if weather is None:
        raise HTTPException(status_code=404, detail=f"Weather data not found for city: {city}")
    return WeatherResponse(**weather)


@router.get("/{city}/forecast", response_model=ForecastResponse)
def weather_forecast(city: str, lang: str = Query("en")):
    """Get 5-day weather forecast for a city."""
    forecast = get_forecast(city, lang)
    if forecast is None:
        raise HTTPException(status_code=404, detail=f"Forecast data not found for city: {city}")
    return ForecastResponse(**forecast)
