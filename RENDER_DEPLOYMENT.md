# Render Deployment Guide for EduNavia

## Summary of Fixes Applied

✅ **render.yaml** — Updated gunicorn command with proper flags
✅ **recommendation.js** — Added better error logging and fallback UI messages  
✅ **vite.config.js** — Fixed API URL detection for production builds
✅ **main.py** — Added startup logging to diagnose static file mounting

---

## Steps to Deploy on Render

### 1. **Connect Your Repository**
- Log in to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository (`Eshajha19/EduNavia`)
- Select branch: `deploy-fix` (or your current branch)

### 2. **Set Environment Variables**

In Render dashboard, go to **Environment** and add these variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
PYTHON_VERSION=3.10.0
```

Additional optional variables:
```
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. **Verify Render Configuration**

Make sure these are set correctly:

- **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
- **Start Command**: `cd backend && gunicorn -w 1 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT --access-logfile - --error-logfile - main:app`
- **Runtime**: Python 3.10

### 4. **Deploy**

- Click "Create Web Service"
- Wait for build to complete
- Watch logs for any errors

---

## Troubleshooting

### If you see: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Check Render logs for:**

1. **Backend startup errors:**
   ```
   ❌ ERROR: Frontend index.html not found!
   ```
   → The `/dist` folder isn't being created from the Vite build

2. **Missing models:**
   ```
   ⚠️ Warning: Models not found in models/
   ```
   → Run `python model.py` in backend directory locally and commit the `models/` folder

3. **Port binding issues:**
   ```
   Address already in use
   ```
   → Render assigns `$PORT` dynamically; make sure gunicorn uses it

### If API calls still fail:

1. **Check browser console** (Dev Tools → Network)
   - What's the actual URL being requested?
   - What's the response status and error message?

2. **Check Render logs** for Python errors
   - Backend crash on startup?
   - Missing dependencies?

3. **Test backend endpoint directly:**
   ```bash
   curl https://your-render-url.onrender.com/recommendations \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"wishlist": ["Computer Science"]}'
   ```

---

## How It Works on Render

1. **Frontend Build**: Vite bundles all HTML/CSS/JS into `/dist`
2. **Backend Server**: FastAPI serves `/dist` as static files AND API endpoints
3. **Single URL**: Both frontend and backend run on the same Render service URL
   - Frontend calls `/recommendations` (same origin)
   - Backend handles both static files and API routes

---

## Local Testing

To test the complete setup locally:

```bash
# Terminal 1: Start backend
cd backend
pip install -r requirements.txt
python main.py

# Terminal 2: Build frontend
cd frontend
npm install
npm run build

# Open http://localhost:8000 in browser
```

The backend will:
1. Serve static files from `../dist` (Vite build output)
2. Listen for API requests like `/recommendations`

---

## Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 502 Bad Gateway | Backend crashed | Check Render logs, fix Python errors |
| API returns 404 | Endpoint doesn't exist | Check `main.py` endpoints, verify route path |
| Slow response | ML models loading | Models load on first request; subsequent calls are fast |
| 413 Request Too Large | Payload too big | Wishlist array might be too large |

---

## Next Steps

1. **Commit these changes** to your repo:
   ```bash
   git add render.yaml frontend/recommendation.js frontend/vite.config.js backend/main.py
   git commit -m "Fix: Render deployment - improve API URL handling and logging"
   git push origin deploy-fix
   ```

2. **Deploy on Render** and monitor logs

3. **Share Render URL** if you need debugging help

