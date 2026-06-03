from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from dotenv import load_dotenv
from typing import Optional
import logging
import traceback
import asyncio

# Import all agents
from agents.weather_agent import get_weather
from agents.irrigation_agent import get_irrigation_advice, CROP_WATER_NEEDS
from agents.fertilizer_agent import get_fertilizer_advice, CROP_FERTILIZER_PLAN, DISEASE_ADJUSTMENT
from agents.llm_advisory_agent import get_llm_advice
from agents.disease_agent import predict_disease, get_treatment
from agents.chatbot_agent import chat_with_bot

load_dotenv()

# ── Constants ──────────────────────────────────────
SUPPORTED_CROPS = set(CROP_WATER_NEEDS.keys()) | set(CROP_FERTILIZER_PLAN.keys())
SUPPORTED_DISEASES = set(DISEASE_ADJUSTMENT.keys())
MAX_MESSAGE_LENGTH = 2000
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB

# Request/Response models with validation
class AnalysisRequest(BaseModel):
    crop: str
    city: str
    stage: str
    area_acres: float
    disease: str
    
    @validator('crop')
    def validate_crop(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Crop must be a non-empty string")
        if v.lower() not in SUPPORTED_CROPS:
            raise ValueError(f"Crop '{v}' not supported. Supported crops: {', '.join(sorted(SUPPORTED_CROPS))}")
        return v.lower()
    
    @validator('city')
    def validate_city(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("City must be a non-empty string")
        if len(v) < 2 or len(v) > 100:
            raise ValueError("City name must be between 2 and 100 characters")
        return v.strip()
    
    @validator('stage')
    def validate_stage(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Stage must be a non-empty string")
        return v.lower()
    
    @validator('area_acres')
    def validate_area(cls, v):
        if not isinstance(v, (int, float)):
            raise ValueError("Area must be a number")
        if v <= 0 or v > 10000:
            raise ValueError("Area must be between 0 and 10000 acres")
        return v
    
    @validator('disease')
    def validate_disease(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Disease must be a non-empty string")
        if v.lower() not in SUPPORTED_DISEASES:
            raise ValueError(f"Disease '{v}' not recognized. Supported: {', '.join(sorted(SUPPORTED_DISEASES))}")
        return v.lower()

class AnalysisResponse(BaseModel):
    crop: str
    city: str
    weather: dict
    irrigation: dict
    fertilizer: dict
    final_advice: str

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[list] = None
    
    @validator('message')
    def validate_message(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Message must be a non-empty string")
        if len(v.strip()) == 0:
            raise ValueError("Message cannot be empty or whitespace only")
        if len(v) > MAX_MESSAGE_LENGTH:
            raise ValueError(f"Message must be under {MAX_MESSAGE_LENGTH} characters")
        return v.strip()

class ChatResponse(BaseModel):
    response: str

app = FastAPI(title="AgriBot Pakistan")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Helper Functions ──────────────────────────────
def get_weather_api_key(req: Request) -> str:
    """Extract and validate weather API key from request headers"""
    key = req.headers.get('X-Weather-API-Key')
    if not key:
        raise HTTPException(status_code=401, detail="Weather API key is required. Please add your OpenWeather API key in settings.")
    return key

def get_groq_api_key(req: Request) -> str:
    """Extract and validate Groq API key from request headers"""
    key = req.headers.get('X-API-Key')
    if not key:
        raise HTTPException(status_code=401, detail="API key is required. Please add your Groq API key in settings.")
    return key

# ── Endpoints ──────────────────────────────────────

# Health check endpoint
@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "AgriBot Pakistan API"}

# Debug endpoint for testing file uploads
@app.post("/api/debug/upload-test")
async def debug_upload_test(file: UploadFile = File(...)):
    """Debug endpoint to test file uploads"""
    try:
        image_bytes = await file.read()
        if len(image_bytes) > MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=413, detail=f"File size exceeds {MAX_UPLOAD_SIZE / 1024 / 1024}MB limit")
        
        return {
            "status": "success",
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(image_bytes),
            "first_bytes": image_bytes[:10].hex()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload test error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }

# Weather endpoint
@app.get("/api/weather")
@app.get("/weather")  # Support both paths
async def weather(req: Request, city: str = Query(..., min_length=2, max_length=100, description="City name")):
    """Get weather data for a location"""
    try:
        weather_key = get_weather_api_key(req)
        
        if not city or len(city.strip()) < 2:
            raise HTTPException(status_code=400, detail="City name must be at least 2 characters")
        
        weather_data = await get_weather(city.strip(), weather_key)
        return weather_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Weather error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get weather data: {str(e)}")

# Irrigation endpoint
@app.get("/api/irrigation")
@app.get("/irrigation")  # Support both paths
async def irrigation(
    req: Request,
    crop: str = Query(..., description="Crop type"),
    city: str = Query(..., min_length=2, max_length=100, description="City name")
):
    """Get irrigation advice for a crop and location"""
    try:
        weather_key = get_weather_api_key(req)
        
        # Validate crop
        if crop.lower() not in SUPPORTED_CROPS:
            raise HTTPException(
                status_code=400,
                detail=f"Crop '{crop}' not supported. Supported crops: {', '.join(sorted(SUPPORTED_CROPS))}"
            )
        
        # Get weather data first
        weather_data = await get_weather(city.strip(), weather_key)
        irrigation_advice = await get_irrigation_advice(crop.lower(), city.strip())
        return irrigation_advice
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Irrigation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get irrigation advice: {str(e)}")

# Fertilizer endpoint
@app.get("/api/fertilizer")
@app.get("/fertilizer")  # Support both paths
async def fertilizer(
    crop: str = Query(..., description="Crop type"),
    stage: str = Query("sowing", description="Growth stage"),
    area: float = Query(1.0, gt=0, le=10000, description="Area in acres"),
    disease: str = Query("healthy", description="Disease status")
):
    """Get fertilizer advice for a crop"""
    try:
        # Validate crop
        if crop.lower() not in SUPPORTED_CROPS:
            raise HTTPException(
                status_code=400,
                detail=f"Crop '{crop}' not supported. Supported crops: {', '.join(sorted(SUPPORTED_CROPS))}"
            )
        
        # Validate disease
        if disease.lower() not in SUPPORTED_DISEASES:
            raise HTTPException(
                status_code=400,
                detail=f"Disease '{disease}' not recognized. Supported: {', '.join(sorted(SUPPORTED_DISEASES))}"
            )
        
        fertilizer_advice = get_fertilizer_advice(crop.lower(), stage.lower(), area, disease.lower())
        return fertilizer_advice
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fertilizer error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get fertilizer advice: {str(e)}")

# Advisory endpoint
@app.post("/api/advisory")
async def advisory(data: dict):
    """Get general agriculture advisory"""
    try:
        query = data.get("query", "").strip()
        if not query:
            raise HTTPException(status_code=400, detail="Query field is required and cannot be empty")
        
        if len(query) > MAX_MESSAGE_LENGTH:
            raise HTTPException(status_code=400, detail=f"Query must be under {MAX_MESSAGE_LENGTH} characters")
        
        advice = await get_llm_advice({"question": query})
        return {"advice": advice}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Advisory error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get advisory: {str(e)}")

# Disease detection endpoints
@app.post("/api/disease/analyze")
@app.post("/disease")  # Support both paths
async def disease_analyze(file: UploadFile = File(...)):
    """Analyze plant disease from image"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Validate file type
        if file.content_type and not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image (jpeg, png, webp, etc.)")
        
        image_bytes = await file.read()
        
        # Validate file size
        if len(image_bytes) > MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=413, detail=f"Image size exceeds {MAX_UPLOAD_SIZE / 1024 / 1024}MB limit")
        
        result = predict_disease(image_bytes)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Disease analysis error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to analyze disease: {str(e)}")

# Treatment suggestion endpoint
@app.get("/disease/treatment")
async def get_disease_treatment(
    crop: str = Query(..., description="Crop type"),
    disease: str = Query(..., description="Disease name"),
    severity: str = Query(..., description="Disease severity")
):
    """Get treatment suggestions for a detected disease"""
    try:
        # Validate inputs
        if not crop or not disease or not severity:
            raise HTTPException(status_code=400, detail="Crop, disease, and severity are required")
        
        severity_valid = severity.lower() in ["low", "medium", "high"]
        if not severity_valid:
            raise HTTPException(status_code=400, detail="Severity must be low, medium, or high")
        
        treatment = get_treatment(crop, disease, severity)
        return {"treatment": treatment}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Treatment error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get treatment: {str(e)}")

# Multi-agent analysis endpoint
@app.post("/analyze")
async def multi_agent_analysis(req: Request, request: AnalysisRequest):
    """Orchestrate multi-agent pipeline for comprehensive farm analysis"""
    try:
        # Extract API keys from headers
        groq_key = get_groq_api_key(req)
        weather_key = get_weather_api_key(req)
        
        # Run all agents in parallel using asyncio.gather
        weather_data, irrigation_data = await asyncio.gather(
            get_weather(request.city, weather_key),
            get_irrigation_advice(request.crop, request.city)
        )
        
        # Get fertilizer advice (sync function, run in executor)
        loop = asyncio.get_event_loop()
        fertilizer_data = await loop.run_in_executor(
            None,
            get_fertilizer_advice,
            request.crop,
            request.stage,
            request.area_acres,
            request.disease
        )
        
        # Generate final advisory
        advisory_input = {
            "crop": request.crop,
            "city": request.city,
            "weather": weather_data,
            "irrigation": irrigation_data,
            "fertilizer": fertilizer_data
        }
        
        final_advice = await get_llm_advice(advisory_input, groq_key)
        
        return AnalysisResponse(
            crop=request.crop,
            city=request.city,
            weather=weather_data,
            irrigation=irrigation_data,
            fertilizer=fertilizer_data,
            final_advice=final_advice
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Multi-agent analysis error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Chatbot endpoint
@app.post("/api/chat")
@app.post("/chat")  # Support both paths
async def chatbot(req: Request, chat_request: ChatMessage):
    """Chat with AgriBot powered by Groq LLM"""
    try:
        api_key = get_groq_api_key(req)
        
        response = await chat_with_bot(chat_request.message, api_key, chat_request.conversation_history)
        return ChatResponse(response=response)
    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get response: {str(e)}")