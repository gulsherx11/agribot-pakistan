import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

CHATBOT_SYSTEM_PROMPT = """
You are AgriBot, a helpful agricultural assistant for Pakistani farmers.
You provide expert advice on:
- Crop selection and management
- Disease detection and treatment
- Irrigation and water management
- Fertilizer recommendations
- Weather-related farming decisions
- General farming practices

Guidelines:
1. Always respond in simple, farmer-friendly language
2. Avoid technical jargon
3. Provide practical, actionable advice
4. Be supportive and encouraging
5. When you don't know something, admit it honestly

Keep responses concise and focused on the user's question.
"""

async def chat_with_bot(user_message: str, api_key: str, conversation_history: list = None) -> str:
    """
    Send a message to the chatbot and get a response from Groq LLM
    
    Args:
        user_message: The user's message
        api_key: Groq API key (can be from user or environment)
        conversation_history: List of previous messages in format [{"role": "user/assistant", "content": "..."}]
    
    Returns:
        The bot's response
    """
    try:
        # Use provided API key or fall back to environment variable
        key = api_key or os.getenv("GROQ_API_KEY")
        if not key:
            raise ValueError("No API key provided. Please configure your Groq API key.")
        
        client = Groq(api_key=key)
        
        # Build messages list
        messages = [{"role": "system", "content": CHATBOT_SYSTEM_PROMPT}]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call Groq API
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        bot_response = response.choices[0].message.content
        return bot_response
        
    except Exception as e:
        # Log error without exposing sensitive details
        print(f"Chatbot error: {type(e).__name__}")
        # Return fallback response if API fails
        return "I apologize, but I'm having trouble connecting to the server right now. Please try again in a moment."
