import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """
You are AgriBot, an expert agricultural assistant for Pakistani farmers.
You receive structured data from multiple AI agents and your job is to:
1. Summarize all findings in simple, friendly language
2. Give clear actionable advice
3. Always respond in BOTH English and Urdu (using proper Urdu script, NOT Roman Urdu)
4. Keep responses short and practical — farmers are busy people
5. Use simple words, no technical jargon

Format your response exactly like this:
🌾 ENGLISH:
[English advice here in simple words]

🌾 اردو:
[Urdu advice here using proper اردو script - ہجے کے ساتھ]

IMPORTANT: Use proper Urdu script characters (اردو حروف) for the Urdu section. Do NOT use Roman characters or Romanized Urdu.
"""

async def get_llm_advice(agent_data: dict, api_key: str = None) -> str:
    
    # build context from all agent outputs
    weather = agent_data.get('weather', {})
    irrigation = agent_data.get('irrigation', {})
    fertilizer = agent_data.get('fertilizer', {})
    
    context = f"""
Farmer's Query Data:
- Crop: {agent_data.get('crop', 'unknown')}
- Location: {agent_data.get('city', 'unknown')}
- Area: {agent_data.get('area_acres', 1)} acres

Weather Conditions:
- Temperature: {weather.get('temperature', 'N/A')}°C
- Humidity: {weather.get('humidity', 'N/A')}%
- Condition: {weather.get('condition', 'N/A')}
- Wind Speed: {weather.get('wind_speed', 'N/A')} m/s
- Pressure: {weather.get('pressure', 'N/A')} hPa

Irrigation Advice:
- Water Needed: {irrigation.get('water_needed', 'N/A')}mm
- Timing: {irrigation.get('timing', 'N/A')}
- Frequency: {irrigation.get('frequency', 'N/A')}

Fertilizer Advice:
- Type: {fertilizer.get('type', 'N/A')}
- Quantity: {fertilizer.get('quantity', 'N/A')}kg
- Timing: {fertilizer.get('timing', 'N/A')}

Based on all this data, give the farmer clear, actionable advice in both English and Urdu.
Remember: The Urdu section MUST use proper Urdu script (اردو حروف) - absolutely NO Roman characters or Romanized Urdu.
"""

    try:
        # Use provided API key or fall back to environment variable
        key = api_key or os.getenv("GROQ_API_KEY")
        if not key:
            raise ValueError("No API key provided. Please configure your Groq API key.")
        
        client = Groq(api_key=key)
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": context}
            ],
            max_tokens=500,
            temperature=0.4
        )

        advice = response.choices[0].message.content
        return advice
    except Exception as e:
        # Return demo advice if API fails
        return f"""
🌾 ENGLISH:
Based on current conditions, here's your farming advice:
- For {agent_data.get('crop', 'your crop')}, water when soil is dry to 2 inches depth
- Apply fertilizer at {fertilizer.get('timing', 'recommended times')}
- Current weather is {weather.get('condition', 'favorable')} - plan activities accordingly

🌾 اردو:
موجودہ حالات کے لحاظ سے آپ کی کاشتکاری کے لیے مشورہ:
- {agent_data.get('crop', 'آپ کی فصل')} کے لیے جب مٹی خشک ہو تو پانی دیں
- کھاد {fertilizer.get('timing', 'مناسب وقت پر')} لگائیں
- موجودہ موسم {weather.get('condition', 'اچھا')} ہے"""