# 🚀 Edu Navia - Deployment Guide

Edu Navia uses a **Unified Backend Architecture** with organized project structure for easy deployment on Render.

## 📁 Project Structure
```
/workspaces/EduNavia/
├── backend/          # FastAPI backend code
├── frontend/         # Vite frontend source
├── models/           # ML models (joblib)
├── dist/             # Vite build output (auto-generated)
├── dev/              # Development files and data
└── render.yaml       # Render deployment config
```

---

## 🟢 Local Development
### Prerequisites
- Node.js and npm
- Python 3.10+
- Git

### Setup Steps

1. **Clone and navigate to project:**
   ```bash
   git clone <your-repo>
   cd EduNavia
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

5. **Start backend:**
   ```bash
   cd backend
   python main.py
   ```

6. **Access the app:**
   - Open http://localhost:8000 in your browser

---

## 🚀 Render Deployment

### Automatic Deployment
1. **Connect your GitHub repo to Render**
2. **Create a new Web Service**
3. **Use these settings:**
   - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT`
   - **Python Version:** 3.10.0

### Environment Variables (Set in Render Dashboard)
- `GEMINI_API_KEY` - Your Google Gemini API key
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

---

## 🔧 Manual Commands for Codespaces

If you need to run commands manually in GitHub Codespaces:

```bash
# Install frontend deps
cd frontend && npm install

# Build frontend
cd frontend && npm run build

# Install backend deps
cd backend && pip install -r requirements.txt

# Start server
cd backend && python main.py
```

---

## 🔐 Environment Setup

### Frontend environment
Create a `.env` file in `frontend/` with:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:8000
```

### Backend environment
Create a `.env` file in `backend/` with:
```
GEMINI_API_KEY=your_gemini_api_key
```

For production, set `VITE_API_URL` to your Render app URL and add backend secrets through the Render dashboard.

---

### 🛑 Status Checklist
- [x] **Unified API:** Running on Port 8000.
- [x] **Static Assets:** Build complete and served from `/dist`.
- [x] **Models:** Loaded from `backend/models`.
- [x] **Chatbot:** Active via `os.dotenv` integration in `main.py`.

*No more separate `app.py` or Docker required! Just pure, fast execution.*
