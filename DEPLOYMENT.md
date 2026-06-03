# AgriBot Deployment Guide

## User Setup Instructions

AgriBot uses user-provided API keys for security. This means:
- **No API keys are hardcoded** in the application
- Each user manages their own API credentials
- Keys are stored locally in the browser and never sent to the developer's servers

### Getting Started

#### 1. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

#### 2. Configure API Key in AgriBot

1. Open the AgriBot web application
2. Click the **⚙️ Settings icon** in the top-right corner of the header
3. A modal will appear asking for your Groq API key
4. Paste your API key in the input field
5. Click **Save**
6. Your API key is now stored locally in your browser

**Important:** Your API key is:
- ✅ Stored only in your browser's local storage
- ✅ Never sent to AgriBot servers
- ✅ Never shared with anyone
- ✅ You can delete it anytime from settings

### For Developers: Deployment

#### Backend Deployment

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **(Optional) Environment Setup**
   - For development/testing, you can optionally add a `.env` file:
   ```bash
   # .env (optional, for backwards compatibility with development)
   GROQ_API_KEY=your_key_here
   ```
   - **Note:** This is only for development. Production uses user-provided keys.

3. **Deploy**
   - Deploy the backend server (FastAPI)
   - Ensure it's accessible to the frontend
   - Update CORS settings if needed in `main.py`

4. **Frontend Deployment**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

5. **Environment Configuration**
   - Set `VITE_API_URL` environment variable if backend is on a different URL
   - Default: `http://localhost:8000`

### Security Best Practices

1. **Keep your API key private** - Don't share it with anyone
2. **Use browser-private mode** if using shared computers
3. **Clear settings** before leaving a shared computer:
   - Click Settings → Click Clear button
4. **Monitor your API usage** on [Groq Console](https://console.groq.com)
5. **Rotate keys** regularly if you suspect compromise
6. **Use environment variables** on server-side applications only

### Troubleshooting

#### "API key is required"
- Go to Settings and add your Groq API key
- Make sure you've copied the entire key (starts with `gsk_`)

#### "API key is invalid"
- Verify the key is correct on [Groq Console](https://console.groq.com)
- Try regenerating a new key if the old one is expired
- Paste the new key in Settings

#### "Server connection failed"
- Ensure the backend server is running
- Check if `VITE_API_URL` is set correctly
- Verify firewall settings

#### "Rate limit exceeded"
- You've exceeded Groq's API rate limits
- Wait a moment and try again
- Check your usage on [Groq Console](https://console.groq.com)

### API Endpoints

All endpoints require the `X-API-Key` header:

```
X-API-Key: gsk_your_key_here
```

#### Chatbot Endpoint
- **POST** `/api/chat` or `/chat`
- **Body:** 
  ```json
  {
    "message": "What should I plant?",
    "conversation_history": [optional conversation history]
  }
  ```

### Support

- For Groq API issues: Visit [Groq Documentation](https://console.groq.com/docs)
- For AgriBot issues: Check the GitHub repository
