# 🚀 Deployment Guide - Project Adam

## Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │───▶│   Railway       │
│   (Frontend)    │    │   (Backend)     │
│   Next.js       │    │   FastAPI       │
└─────────────────┘    └─────────────────┘
        │                      │
        └───────┬──────────────┘
                │
        ┌───────▼───────┐
        │  Google AI    │
        │  Gemini API   │
        └───────────────┘
```

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 1.2 Create New Project
```bash
# In your project root
cd backend
```

### 1.3 Deploy via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize new project
railway init

# Deploy
railway up
```

### 1.4 Or Deploy via GitHub
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `VietNamLookmaxing` repo
4. Set root directory to `backend`

### 1.5 Add Environment Variables
In Railway dashboard, go to Variables tab and add:
```
GOOGLE_API_KEY=your_google_api_key
LLM_PROVIDER=gemini
DEBUG=false
FRONTEND_URL=https://your-app.vercel.app
```

### 1.6 Get Your Backend URL
After deploy, Railway will give you a URL like:
`https://project-adam-backend-production.up.railway.app`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### 2.2 Import Project
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set Framework: Next.js
4. Set Root Directory: `frontend`

### 2.3 Add Environment Variables
In Vercel dashboard, go to Settings > Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
```

### 2.4 Deploy
Click Deploy and wait for build to complete.

---

## Step 3: Update CORS

After both are deployed, update the backend's FRONTEND_URL in Railway:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Quick Commands

### Local Development
```bash
# Terminal 1 - Backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Check Status
- Backend Health: `https://your-backend.railway.app/api/v1/health`
- Frontend: `https://your-app.vercel.app`
- API Docs: `https://your-backend.railway.app/docs`

---

## Troubleshooting

### CORS Error
Make sure `FRONTEND_URL` in Railway matches your Vercel domain exactly.

### Camera Not Working on Mobile
- Ensure HTTPS is enabled (Vercel provides this by default)
- Camera requires secure context (HTTPS)

### API Key Issues
- Verify GOOGLE_API_KEY is set correctly in Railway
- Check Railway logs for errors

---

## Cost Estimates

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | 100GB/month | Frontend hosting |
| Railway | $5 credit/month | Backend hosting |
| Gemini API | $300 credit | Your GCP credits |

**Total: ~$0/month** with free tiers and your GCP credits 🎉
