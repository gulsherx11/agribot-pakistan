from agents.weather_agent import get_weather

CROP_WATER_NEEDS = {
    "wheat":       {"daily_mm": 5,  "sensitive_temp": 35},
    "rice":        {"daily_mm": 10, "sensitive_temp": 40},
    "sugarcane":   {"daily_mm": 8,  "sensitive_temp": 42},
    "cotton":      {"daily_mm": 6,  "sensitive_temp": 38},
    "maize":       {"daily_mm": 7,  "sensitive_temp": 36},
    "tomato":      {"daily_mm": 6,  "sensitive_temp": 35},
    "potato":      {"daily_mm": 5,  "sensitive_temp": 30},
}

async def get_irrigation_advice(crop: str, city: str = "Lahore") -> dict:
    try:
        crop = crop.lower()
        weather = await get_weather(city)

        if crop not in CROP_WATER_NEEDS:
            return {"error": f"Crop '{crop}' not supported yet"}

        needs = CROP_WATER_NEEDS[crop]
        base_mm = needs["daily_mm"]
        sensitive_temp = needs["sensitive_temp"]

        temp = weather["temperature"]
        humidity = weather["humidity"]
        condition = weather["condition"]

        # adjust water need based on conditions
        adjusted_mm = base_mm
        if temp > sensitive_temp:
            adjusted_mm += 2
        if humidity < 35:
            adjusted_mm += 1.5
        if "rain" in condition.lower():
            adjusted_mm = 0

        # timing advice
        if temp > 36:
            timing = "Early morning (6-8 AM) or evening (6-8 PM)"
        else:
            timing = "Early morning (7-9 AM)"

        # frequency
        if adjusted_mm == 0:
            frequency = "Skip today - rain forecasted"
        elif adjusted_mm > 8:
            frequency = "Daily irrigation"
        else:
            frequency = "Every 2 days"

        return {
            "water_needed": round(adjusted_mm, 1),
            "frequency": frequency,
            "timing": timing,
            "crop": crop,
            "city": city
        }
    except Exception as e:
        raise Exception(f"Irrigation advice error: {str(e)}")