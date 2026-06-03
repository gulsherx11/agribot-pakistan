# 🌾 AgriBot Pakistan

**AI-powered multi-agent agricultural intelligence and advisory system for farmers in Pakistan.**

An intelligent farming assistant that uses machine learning and multi-agent systems to provide real-time agricultural advice covering weather, irrigation, fertilizer recommendations, and disease detection.

---

## ✨ Features

- 🤖 **Multi-Agent System**: Weather, Irrigation, Fertilizer, Disease Detection, and LLM Advisory agents
- 🎯 **Disease Detection**: Real-time plant disease identification from images using deep learning
- 🌧️ **Weather Integration**: Real-time weather data and forecasting with OpenWeather API
- 💧 **Smart Irrigation**: AI-powered irrigation scheduling based on crop type and weather conditions
- 🧪 **Fertilizer Recommendations**: Precision fertilizer advice based on crop stage and health
- 💬 **Interactive Chatbot**: Groq LLM-powered agricultural chatbot with conversation history
- 🌐 **Bilingual Support**: English and Urdu (Nastaliq script) responses for accessibility
- 🔒 **Secure**: API key-based authentication, no server-side key storage, local browser storage
- 📱 **Responsive UI**: Modern React + TypeScript frontend with dark/light mode support
- ⚡ **Fast & Scalable**: FastAPI backend with async processing and parallel agent execution

---

## 🏗️ Architecture

### Multi-Agent Workflow
```
User Input
    ↓
Weather Agent → Get current weather & conditions
    ↓
Irrigation Agent → Calculate water needs based on crop & weather
    ↓
Fertilizer Agent → Recommend fertilizer based on crop stage & soil conditions
    ↓
Disease Detection → Analyze plant images for diseases
    ↓
LLM Advisory Agent → Synthesize all data into actionable advice
    ↓
Bilingual Response (English + Urdu)
```

### Tech Stack

**Backend:**
- Python 3.9+
- FastAPI - Modern async web framework
- PyTorch - Deep learning for disease detection
- Groq API - Large language model for advisory
- LangGraph - Multi-agent orchestration
- httpx - Async HTTP client

**Frontend:**
- React 18 + TypeScript
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client
- Dark/Light mode support

**APIs:**
- OpenWeather API - Weather data
- Groq API - LLM capabilities
- Custom disease detection model

---

## 📋 Prerequisites

- Python 3.9 or higher
- Node.js 16+ and npm
- API Keys:
  - Groq API key (free from [console.groq.com](https://console.groq.com))
  - OpenWeather API key (free from [openweathermap.org](https://openweathermap.org))

---

## 🚀 Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (optional for local development):
```bash
cp .env.example .env
# Edit .env with your API keys (only needed if not using web interface)
```

5. Run the backend server:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🔑 API Key Configuration

API keys can be configured in two ways:

### Method 1: Web Interface (Recommended)
- Click the "⚙️ Settings" button in the app
- Enter your Groq and OpenWeather API keys
- Keys are stored locally in your browser (never sent to servers)

### Method 2: Environment Variables
- Create `.env` file in backend directory
- Add your keys:
```
GROQ_API_KEY=your_key_here
OPENWEATHER_KEY=your_key_here
```

---

## 📡 API Endpoints

### Weather
```
GET /api/weather?city=Lahore
Headers: X-Weather-API-Key: your_key
```

### Irrigation Advice
```
GET /api/irrigation?crop=wheat&city=Lahore
Headers: X-Weather-API-Key: your_key
```

### Fertilizer Recommendations
```
GET /api/fertilizer?crop=wheat&stage=sowing&area=2.5&disease=healthy
```

### Disease Detection
```
POST /api/disease/analyze
Body: multipart/form-data with image file
```

### Disease Treatment
```
GET /disease/treatment?crop=wheat&disease=rust&severity=high
```

### Complete Analysis
```
POST /analyze
Headers: X-API-Key, X-Weather-API-Key
Body: {
  "crop": "wheat",
  "city": "Lahore",
  "stage": "sowing",
  "area_acres": 2.5,
  "disease": "healthy"
}
```

### Chatbot
```
POST /api/chat
Headers: X-API-Key: your_groq_key
Body: {
  "message": "Your question",
  "conversation_history": []
}
```

---

## 🌱 Supported Crops

- Wheat
- Rice
- Cotton
- Maize
- Sugarcane
- Tomato
- Potato

---

## 🔐 Security Features

✅ **API Key Protection:**
- Keys transmitted via secure headers (X-API-Key, X-Weather-API-Key)
- Client-side storage only (never logged or exposed)
- Input validation on all endpoints
- File size limits (10MB) and type validation

✅ **Input Validation:**
- Crop name validation against supported list
- City name length validation (2-100 chars)
- Area validation (0-10,000 acres)
- Message length limits (2000 chars)
- Disease status validation
- File upload validation (image types, size limits)

✅ **Error Handling:**
- Sensitive details never exposed in error responses
- Proper logging without exposing credentials
- Generic user-friendly error messages

---

## 📚 Project Structure

```
agribot-pakistan/
├── backend/
│   ├── agents/
│   │   ├── weather_agent.py
│   │   ├── irrigation_agent.py
│   │   ├── fertilizer_agent.py
│   │   ├── disease_agent.py
│   │   ├── chatbot_agent.py
│   │   └── llm_advisory_agent.py
│   ├── graph/
│   │   └── agri_graph.py
│   ├── models/
│   │   ├── disease_model.pth
│   │   ├── class_labels.json
│   │   └── model_info.json
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── DEPLOYMENT.md
├── README.md
└── LICENSE
```

---

## 🛠️ Development

### Code Quality
- No duplicate endpoints (consolidated to single implementations)
- Comprehensive input validation using Pydantic validators
- Proper error handling and logging throughout
- Type hints for better code maintainability

### Testing
```bash
# Run backend tests
cd backend
python -m pytest

# Run frontend tests
cd frontend
npm run test
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Local deployment
- Docker containerization
- Cloud platforms (AWS, Azure, Google Cloud)
- Production configuration

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 💡 Getting Help

- Check existing issues on GitHub
- Review API documentation in DEPLOYMENT.md
- Ensure API keys are correctly configured
- Verify backend is running on port 8000
- Check browser console for frontend errors

---

## 🌟 Acknowledgments

- OpenWeather API for weather data
- Groq API for LLM capabilities
- PyTorch community for deep learning framework
- FastAPI for excellent Python web framework
- React community for frontend framework

---

## 📞 Contact

For questions or support, please open an issue on GitHub.

**Made with ❤️ for farmers in Pakistan**
