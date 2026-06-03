# Railway & Vercel Deployment Guide

## 🚂 Railway Deployment (Backend + Frontend)

Railway is the simplest option - it deploys both your backend and frontend from GitHub automatically.

### Prerequisites
- GitHub account with your repo pushed
- Railway account (https://railway.app)

### Step 1: Connect to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "**New Project**"
4. Select "**Deploy from GitHub repo**"
5. Authorize Railway to access your repositories
6. Select `agribot-pakistan` repository
7. Click "**Deploy Now**"

### Step 2: Configure Backend Service

Railway auto-detects Python and will create a service. Configure it:

1. Click on the **backend** service
2. Go to **Settings** tab
3. Set the **Start Command**:
   ```bash
   pip install -r requirements.txt && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. Add **Environment Variables**:
   - Click **Variables**
   - Add:
     ```
     GROQ_API_KEY = your_groq_key
     OPENWEATHER_KEY = your_openweather_key
     ```

5. Under **Networking**, enable **Public URL**
6. Copy the public URL (e.g., `https://agribot-backend-production.up.railway.app`)

### Step 3: Configure Frontend Service

1. Go back to project, click **New Service**
2. Select **GitHub Repo** again
3. Choose same repository
4. Railway should detect Node.js

5. Set **Start Command**:
   ```bash
   npm install --prefix frontend && npm run --prefix frontend build && npx serve -s frontend/dist -l $PORT
   ```

6. Add **Environment Variables**:
   ```
   VITE_API_URL = https://agribot-backend-production.up.railway.app
   ```

7. Enable **Public URL**
8. Copy the public URL (e.g., `https://agribot-frontend-production.up.railway.app`)

### Step 4: Deploy

1. Every push to `main` branch auto-deploys
2. Watch deployment logs in Railway dashboard
3. Once green ✅, your app is live!

### Access Your App

- **Frontend**: `https://agribot-frontend-production.up.railway.app`
- **Backend API**: `https://agribot-backend-production.up.railway.app/health`

---

## ✨ Vercel Deployment (Frontend Only)

Vercel is optimized for frontend hosting. Deploy your React app here and point it to your Railway backend.

### Prerequisites
- GitHub account
- Vercel account (https://vercel.com)
- Backend already deployed on Railway

### Step 1: Deploy on Vercel

1. Go to https://vercel.com
2. Click "**Add New...**" → "**Project**"
3. Select "**Import Git Repository**"
4. Search for `agribot-pakistan`
5. Click "**Import**"

### Step 2: Configure Project Settings

1. **Root Directory**: Select `frontend`
2. **Build Command**: 
   ```bash
   npm run build
   ```
3. **Output Directory**: 
   ```bash
   dist
   ```
4. **Install Command**: 
   ```bash
   npm install
   ```

### Step 3: Add Environment Variables

1. Click "**Environment Variables**"
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://agribot-backend-production.up.railway.app
   ```
3. Click "**Add**"

### Step 4: Deploy

1. Click "**Deploy**"
2. Wait for build to complete ✅
3. You'll get a Vercel domain like: `https://agribot-pakistan.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

---

## 📊 Comparison: Railway vs Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Best For** | Full-stack (backend + frontend) | Frontend only |
| **Setup Time** | 5-10 minutes | 5 minutes |
| **Cost** | $5/month (free tier available) | Free tier included |
| **Deployment** | Auto on GitHub push | Auto on GitHub push |
| **Scalability** | Built-in scaling | Serverless CDN |
| **Database** | Can add PostgreSQL | N/A |
| **Backend Support** | ✅ Yes (Python, Node, etc.) | ❌ No (use serverless functions) |

---

## 🔗 Recommended Architecture

**Best combination for this project:**

```
┌─────────────────────────────────────────┐
│  Vercel (Frontend)                      │
│  https://agribot-pakistan.vercel.app    │
└──────────────┬──────────────────────────┘
               │ API calls
               ↓
┌──────────────────────────────────────────┐
│  Railway (Backend)                       │
│  https://agribot-backend.railway.app     │
│  - Weather API                           │
│  - Disease Detection                     │
│  - LLM Advisory                          │
└──────────────────────────────────────────┘
```

---

## 🚀 Complete Deployment Steps (Both Platforms)

### Option A: Railway for Everything (Recommended)

**Pros:**
- ✅ Single dashboard for everything
- ✅ Auto-connects services
- ✅ Better for full-stack apps
- ✅ Can add database easily

**Steps:**
1. Push code to GitHub
2. Create Railway project from repo
3. Set environment variables
4. Deploy (auto handles both backend + frontend)
5. Done! 🎉

### Option B: Railway Backend + Vercel Frontend

**Pros:**
- ✅ Frontend on blazing-fast Vercel CDN
- ✅ Backend on Railway for scalability
- ✅ Best performance

**Steps:**
1. Deploy backend on Railway (see above)
2. Copy Railway backend URL
3. Deploy frontend on Vercel
4. Set `VITE_API_URL` in Vercel to Railway URL
5. Done! 🎉

---

## 🔒 Security Checklist

- ✅ **Never commit `.env` files** - use environment variables instead
- ✅ **Rotate API keys** if exposed
- ✅ **Enable HTTPS** (both platforms do this by default)
- ✅ **Set CORS** for your domain in `backend/main.py`:
  ```python
  allow_origins=[
      "https://agribot-pakistan.vercel.app",
      "https://your-custom-domain.com"
  ]
  ```
- ✅ **Monitor API usage** on Groq console
- ✅ **Add rate limiting** for production

---

## 🐛 Troubleshooting

### Railway: Deployment fails
- Check logs in Railway dashboard
- Verify Python version is 3.9+
- Ensure `requirements.txt` exists
- Check environment variables are set

### Vercel: Build fails
- Check build logs in Vercel dashboard
- Verify `vite.config.ts` exists
- Ensure `package.json` has correct scripts
- Run `npm run build` locally to test

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit `/health` endpoint)
- Verify CORS is configured in `main.py`
- Check browser console for errors

### API calls return 401
- Verify API keys are set in environment variables
- Check Groq key hasn't expired
- Verify OpenWeather key is valid

---

## 📈 Next Steps After Deployment

1. **Monitor Performance**
   - Railway: Check CPU, memory, network in dashboard
   - Vercel: Check analytics in dashboard

2. **Set up CI/CD**
   - Both platforms auto-deploy on push
   - Add GitHub checks/tests if needed

3. **Add Custom Domain**
   - Both support custom domains
   - Update DNS records

4. **Add Database** (if needed for future features)
   - Railway: PostgreSQL or MongoDB
   - Vercel: Use external database

5. **Enable Logging**
   - Monitor errors in production
   - Set up alerts for failures

---

## 📞 Support Links

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Groq API**: https://console.groq.com/docs
- **OpenWeather API**: https://openweathermap.org/api

---

## ✅ Quick Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `.env` file NOT committed
- [ ] `requirements.txt` updated
- [ ] `package.json` has build script
- [ ] API keys obtained (Groq, OpenWeather)
- [ ] `CORS` configured correctly

After deploying:
- [ ] Test homepage loads
- [ ] Test API endpoint (e.g., `/health`)
- [ ] Test chatbot (requires API key entry)
- [ ] Test settings/API key modal
- [ ] Monitor logs for errors
