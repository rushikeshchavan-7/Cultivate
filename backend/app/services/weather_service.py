import requests
from ..config import settings


LANG_MAP = {"en": "en", "hi": "hi", "mr": "mr"}


def get_weather(city_name: str, lang: str = "en") -> dict | None:
    """Fetch current weather data for a city from OpenWeatherMap API."""
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {"appid": settings.WEATHER_API_KEY, "q": city_name, "units": "metric", "lang": LANG_MAP.get(lang, "en")}

    try:
        response = requests.get(base_url, params=params, timeout=10)
        data = response.json()

        if data.get("cod") == 200 or data.get("cod") == "200":
            main = data["main"]
            wind = data.get("wind", {})
            weather_info = data.get("weather", [{}])[0]
            return {
                "temperature": round(main["temp"], 2),
                "humidity": main["humidity"],
                "feels_like": round(main.get("feels_like", 0), 2),
                "pressure": main.get("pressure", 0),
                "wind_speed": round(wind.get("speed", 0), 2),
                "visibility": data.get("visibility", 0),
                "description": weather_info.get("description", ""),
                "icon": weather_info.get("icon", ""),
                "city": data.get("name", city_name),
                "country": data.get("sys", {}).get("country", ""),
            }
        return None
    except Exception:
        return None


def get_forecast(city_name: str, lang: str = "en") -> dict | None:
    """Fetch 5-day weather forecast for a city."""
    base_url = "http://api.openweathermap.org/data/2.5/forecast"
    params = {"appid": settings.WEATHER_API_KEY, "q": city_name, "units": "metric", "lang": LANG_MAP.get(lang, "en")}

    try:
        response = requests.get(base_url, params=params, timeout=10)
        data = response.json()

        if data.get("cod") == "200":
            forecasts = []
            for item in data["list"]:
                forecasts.append({
                    "datetime": item["dt_txt"],
                    "temperature": round(item["main"]["temp"], 2),
                    "humidity": item["main"]["humidity"],
                    "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"],
                    "wind_speed": round(item["wind"]["speed"], 2),
                })
            return {
                "city": data["city"]["name"],
                "country": data["city"]["country"],
                "forecasts": forecasts,
            }
        return None
    except Exception:
        return None
