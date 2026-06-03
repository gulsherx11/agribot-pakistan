import httpx
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://api.openweathermap.org/data/2.5"

async def get_weather(city: str = "Lahore", api_key: str = None) -> dict:
    try:
        # Use provided API key or fall back to environment variable
        key = api_key or os.getenv("OPENWEATHER_KEY")
        if not key:
            raise ValueError("No OpenWeather API key provided. Please configure your API key.")
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/weather",
                params={
                    "q": city + ",PK",
                    "appid": key,
                    "units": "metric"
                }
            )
            resp.raise_for_status()
            data = resp.json()
        
        if "main" not in data or "weather" not in data:
            raise ValueError(f"Invalid API response: {data}")

        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": data.get("rain", {}).get("1h", 0),
            "condition": data["weather"][0]["description"],
            "wind_speed": data["wind"]["speed"],
            "city": city,
            "pressure": data["main"]["pressure"]
        }
    except Exception as e:
        raise Exception(f"Weather API error for city '{city}': {str(e)}")

def generate_advice(data: dict) -> str:
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    condition = data["weather"][0]["main"]

    if condition == "Rain":
        return "Irrigation skip karo — aaj barish ho rahi hai"
    elif temp > 38:
        return "Zyada garmi — subah ya sham ko irrigate karo"
    elif humidity < 30:
        return "Khushk hawa — pani ki zaroorat zyada ho sakti hai"
    else:
        return "Weather theek hai — normal schedule follow karo"