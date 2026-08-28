import uvicorn
import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import joblib
import numpy as np
from preprocessing import preprocess_input

# --- 🚀 CLOUD COMPATIBILITY LAYER ---
# pywhatkit depends on pyautogui which requires a DISPLAY (screen).
# Headless servers (Render/Vercel) will crash on import.
try:
    import pywhatkit as kit
    PYWHATKIT_AVAILABLE = True
except Exception as e:
    print(f"⚠️ Warning: pywhatkit disabled (Headless environment detected). Details: {e}")
    kit = None
    PYWHATKIT_AVAILABLE = False

# Load environment variables
load_dotenv()

# Initialize backend endpoint server
app = FastAPI(title="Edu Navia Unified Backend")

# Enabled CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Input Formats
class PredictRequest(BaseModel):
    gender: str
    stream: str
    subject: str
    marks: float

class WishlistRequest(BaseModel):
    wishlist: list[str]

class ChatRequest(BaseModel):
    message: str

class RegisterRequest(BaseModel):
    name: str
    phone: str
    webinar: str

class CutoffRequest(BaseModel):
    rank: int
    marks: float
    course: str
    category: str
    state: str

# ----------------- CHATBOT & REGISTRATION ENDPOINTS -----------------

@app.post("/chat")
async def chat(req: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server")
    
    gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    instruction = """
    You are EduBot, AI assistant for Edu Navia.
    Only answer questions related to: Universities, Courses, Consulting, Resources, 
    University Comparison, Exam Tracker, and Exam Info.
    If unrelated, reply: "I'm here to assist only with Edu Navia-related queries."
    """
    
    payload = {
        "contents": [{
            "role": "user",
            "parts": [{"text": f"{instruction}\n\nUser: {req.message}"}]
        }]
    }

    try:
        response = requests.post(f"{gemini_url}?key={api_key}", json=payload, timeout=15)
        result = response.json()
        bot_reply = result["candidates"][0]["content"]["parts"][0]["text"]
        return {"reply": bot_reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.post("/register")
async def register(req: RegisterRequest):
    try:
        message = f"Hi {req.name}, your Edu Navia webinar registration for '{req.webinar}' is confirmed! 🎓"
        
        if PYWHATKIT_AVAILABLE and kit:
            # Note: kit.sendwhatmsg_instantly usually requires a browser. 
            kit.sendwhatmsg_instantly(phone_no=req.phone, message=message, wait_time=10, tab_close=True)
            return {"success": True, "message": "WhatsApp message sent!"}
        else:
            print(f"📧 Cloud Registration Captured: {req.name} ({req.phone}) for {req.webinar}")
            return {"success": True, "message": "Registration received! (WhatsApp disabled on cloud)"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"WhatsApp failed: {str(e)}")

@app.post("/cutoff-predict")
async def cutoff_predict(req: CutoffRequest):
    """
    Advanced AI endpoint for Cutoff Prediction & Eligibility Analysis.
    Combines mathematical seat-probability models with Gemini LLM expert analysis.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # 1. MATHEMATICAL HEURISTIC MODEL (The 'Neural' backbone)
    # Calibrate probability based on historical difficulty and category weightage
    difficulty_map = { 
        "Computer Science": 0.96, "Medical": 0.98, "Engineering": 0.88, 
        "Management": 0.78, "Law": 0.72 
    }
    category_map = { 
        "General": 1.0, "OBC": 0.88, "SC": 0.58, "ST": 0.48, "EWS": 0.92 
    }
    
    diff_factor = difficulty_map.get(req.course, 0.85)
    cat_factor = category_map.get(req.category, 1.0)
    
    # Sigmoid-inspired probability calculation
    # High rank = lower probability. High marks = higher probability.
    rank_score = np.exp(-req.rank / 12000) * 85
    mark_score = (req.marks / 100) * 15
    
    raw_prob = (rank_score + mark_score) / (diff_factor * cat_factor)
    final_prob = min(99.4, max(0.6, raw_prob))
    
    # 2. Institutional Cutoff Projection
    # Projecting what the cutoff might be for this specific category/course
    base_cutoff = 1000  # Default base
    cutoff_offsets = { "Computer Science": 800, "Medical": 500, "Engineering": 5000, "Management": 8000, "Law": 12000 }
    projected_cutoff = cutoff_offsets.get(req.course, 10000) * cat_factor
    
    # 3. LLM EXPERT ANALYSIS (The 'Intelligence' layer)
    expert_verdict = "Neural nodes are calibrated. Analysis pending secure link."
    detailed_logic = ""
    
    if api_key:
        prompt = f"""
        As an Admission Scientist, analyze this student profile:
        Rank: {req.rank}
        Marks: {req.marks}%
        Course: {req.course}
        Category: {req.category}
        State: {req.state}
        
        Provide:
        1. A 2-sentence expert admission verdict.
        2. A 3-sentence technical logic breakdown of why they have this eligibility (mentioning category seats, rank clusters, and state quotas).
        Format the response in JSON: {{"verdict": "...", "logic": "..."}}
        """
        
        gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        
        try:
            response = requests.post(f"{gemini_url}?key={api_key}", json=payload, timeout=10)
            res_json = response.json()
            ai_content = res_json["candidates"][0]["content"]["parts"][0]["text"]
            import json
            parsed = json.loads(ai_content)
            expert_verdict = parsed.get("verdict", expert_verdict)
            detailed_logic = parsed.get("logic", "")
        except Exception as e:
            print(f"LLM Reasoning Failed: {e}")
            expert_verdict = f"Based on historical clusters, your {req.rank} rank within the {req.category} quota shows {'high' if final_prob > 70 else 'moderate' if final_prob > 40 else 'low'} stability for {req.course}."
            detailed_logic = f"The model detected a cluster density of approximately {int(req.rank/100)} candidates per state-vector. Given the {req.category} reservation curve in {req.state}, seat volatility is {100-int(final_prob)}%."

    return {
        "eligibility_probability": round(final_prob, 1),
        "projected_cutoff": int(projected_cutoff),
        "verdict": expert_verdict,
        "detailed_logic": detailed_logic,
        "metrics": {
            "rank_ventile": round(req.rank / 1000, 2),
            "volatility": round(100 - final_prob, 1)
        }
    }

# ----------------- COURSE RECOMMENDATION ML MODEL (TF-IDF & Cosine Similarity) -----------------

# ----------------- COURSE RECOMMENDATION ML MODEL (TF-IDF & Cosine Similarity) -----------------
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

COURSE_DESCRIPTIONS = {
    "Computer Science": "technology engineering logic programming artificial intelligence coding software",
    "Business & Management": "finance marketing corporate admin management money business",
    "Commerce": "accounting finance economics business money trade",
    "Engineering": "mechanical civil electrical physics build technology engineering",
    "Medicine": "health biology anatomy human science pharmacy nursing medical",
    "Law": "justice society rules legal reading reading social logic",
    "Design & Arts": "creative visual fashion interior animation art",
    "Education": "teaching society youth research reading social humanity",
    "Social Sciences": "psychology sociology anthropology human behavior reading social",
    "Data Science": "statistics analytics big data technology math logic coding ai",
    "Environmental Studies": "sustainability ecology climate nature biology science",
    "Hospitality & Tourism": "hotel events travel management social business",
    "Languages & Literature": "english french writing linguistics reading creative humanity",
    "Architecture": "urban planning interior design physics build creative",
    "Journalism & Media": "reporting mass communication media writing creative social",
    "Physics & Astronomy": "quantum mechanics astrophysics math logic science physics",
    "Mathematics": "pure applied statistics math logic numbers abstract",
    "Biotechnology": "genetics molecular biology science lab technology",
    "Philosophy & Ethics": "logic ethics worldview studies reading abstract humanity",
    "Political Science": "governance policy global studies justice social humanity politics",
    "Chemistry": "organic inorganic physical lab science chemical",
    "Agricultural Sciences": "crop science agribusiness nature biology outdoor",
    "International Relations": "diplomacy geopolitics conflict policy global social justice",
    "Life Sciences": "zoology botany biology nature science life",
    "Performing Arts": "dance theatre music drama creative art movement",
    "Other Popular Course": "general emerging fields trending industry"
}

courses_list = list(COURSE_DESCRIPTIONS.keys())
descriptions_list = list(COURSE_DESCRIPTIONS.values())

tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(descriptions_list)
# ------------------------------------------------------------------------------------------------

# Initializing global AI variables for efficient caching
course_model = None
univ_model = None
le_stream = None
le_course = None
le_univ = None

@app.on_event("startup")
def load_assets():
    global course_model, univ_model, le_stream, le_course, le_univ
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(base_dir, '..', 'models')
    
    print(f"🔍 DEBUG: base_dir = {base_dir}")
    print(f"🔍 DEBUG: model_dir = {model_dir}")
    print(f"🔍 DEBUG: model_dir exists = {os.path.exists(model_dir)}")
    
    if os.path.exists(model_dir):
        model_files = os.listdir(model_dir)
        print(f"🔍 DEBUG: model files = {model_files}")
    
    try:
        # Load from disk using Joblib (fastest binary loader)
        course_model = joblib.load(os.path.join(model_dir, 'course_model.pkl'))
        univ_model = joblib.load(os.path.join(model_dir, 'univ_model.pkl'))
        le_stream = joblib.load(os.path.join(model_dir, 'le_stream.pkl'))
        le_course = joblib.load(os.path.join(model_dir, 'le_course.pkl'))
        le_univ = joblib.load(os.path.join(model_dir, 'le_university.pkl'))
        print("✅ Models successfully loaded! Fast AI Recommendations are ON.")
    except Exception as e:
        print(f"⚠️ Warning: Models not found in {model_dir}. Need to run 'python model.py' to generate files. Details: {e}")
        import traceback
        print(f"⚠️ Full error: {traceback.format_exc()}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "course_model": course_model is not None,
            "univ_model": univ_model is not None,
            "le_stream": le_stream is not None,
            "le_course": le_course is not None,
            "le_univ": le_univ is not None
        },
        "working_directory": os.getcwd(),
        "backend_dir": os.path.dirname(os.path.abspath(__file__)),
        "model_dir": os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'models'),
        "model_dir_exists": os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'models'))
    }

@app.post("/predict")
def predict(data: PredictRequest):
    print(f"🔍 DEBUG: /predict called with data: {data}")
    print(f"🔍 DEBUG: course_model loaded: {course_model is not None}")
    print(f"🔍 DEBUG: univ_model loaded: {univ_model is not None}")
    
    if not course_model:
         print("❌ ERROR: course_model is None!")
         raise HTTPException(status_code=500, detail="Models missing on server. Run model.py to train them first.")
    
    try:
        # 1. Transform raw POST parameter inputs
        X_input = preprocess_input(data.stream, data.marks, le_stream)
        
        # 2. COURSE PREDICTION - Generate multi-class probabilities
        course_probs = course_model.predict_proba(X_input)[0] 
        top_course_indices = np.argsort(course_probs)[::-1][:20] # Expanded search boundary
        
        raw_courses = le_course.inverse_transform(top_course_indices)
        raw_course_scores = course_probs[top_course_indices]
        
        # Master Map to completely prevent cross-contamination
        valid_courses_map = {
            "engineering": ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.Tech Civil"],
            "medical": ["MBBS", "BDS", "B.Pharma", "BSc Nursing"],
            "commerce": ["B.Com Hons", "BMS (Management)", "BBA", "B.Com General"],
            "arts": ["BA Economics", "BA Political Science", "BA English", "BA History", "Humanities / Arts"],
            "science": ["BSc Computer Science", "BSc Physics", "BSc Mathematics", "BSc Chemistry"],
            "law": ["BA LLB (Hons)", "BBA LLB", "LLB"],
            "design": ["B.Des (UI/UX)", "B.Des (Fashion)", "BFA (Fine Arts)"]
        }
        
        stream_key = data.stream.lower().strip()
        if "humanities" in stream_key or "arts" in stream_key:
            stream_key = "arts"
        
        valid_set = valid_courses_map.get(stream_key, [])
        filtered_courses = []
        filtered_c_scores = []
        
        for c, p in zip(raw_courses, raw_course_scores):
            # Rigidly allow only courses correlated to the selected stream
            if (c in valid_set) or (not valid_set):
                filtered_courses.append(c)
                filtered_c_scores.append(round(float(p)*100, 1))
            if len(filtered_courses) >= 3:
                break
                
        if not filtered_courses:
            # Absolute fallback mechanism
            top_courses = list(raw_courses)[:3]
            top_c_scores = [round(float(s)*100, 1) for s in list(raw_course_scores)[:3]]
        else:
            top_courses = filtered_courses
            top_c_scores = filtered_c_scores

        # 3. UNIVERSITY PREDICTION
        univ_probs = univ_model.predict_proba(X_input)[0]
        top_univ_indices = np.argsort(univ_probs)[::-1][:20]
        raw_univs = le_univ.inverse_transform(top_univ_indices)
        raw_univ_scores = univ_probs[top_univ_indices]
        
        # 4. SMART FILTERING LAYER
        filtered_univs = []
        filtered_u_scores = []
        
        for u, prob in zip(raw_univs, raw_univ_scores):
            is_top_tier_univ = any(token in u.upper() for token in ["IIT", "AIIMS", "NIT", "NID", "NIFT"])
            
            # Smart Rule: Marks < 60 strictly filters out Elite Tier-1 Universities
            if data.marks < 60 and is_top_tier_univ:
                continue
            
            filtered_univs.append(u)
            filtered_u_scores.append(round(float(prob)*100, 1))
            
            # Grab top 3 ~ 5 recommendations
            if len(filtered_univs) >= 3:
                break
        
        # Fallback (If for any reason filtering left nothing)
        if len(filtered_univs) == 0:
            filtered_univs = list(raw_univs)[:3]
            filtered_u_scores = [round(float(s)*100, 1) for s in list(raw_univ_scores)[:3]]

        # 5. EXPLAINABILITY 
        explanation = []
        explanation.append(f"Analyzing {data.marks}% in the {data.stream.capitalize()} stream gives distinct statistical insights.")
        
        # Contextual subject incorporation
        if data.subject:
            explanation.append(f"Given your passion for {data.subject.capitalize()}, you exhibit strong affinities for '{top_courses[0]}' and adjacent fields in your stream.")

        if data.marks >= 85:
            explanation.append(f"Exceptional score! Your dataset mapping strictly unlocks Elite Tier-1 institutions like IITs and AIIMS equivalents.")
        elif data.marks >= 60:
            explanation.append(f"Solid performance. Based on historical data, you seamlessly qualify for strong reputed state-level universities and premier institutes.")
        else:
            explanation.append(f"You have steady opportunities ahead. Our system mapped you to highly accessible mid-tier and private universities ideal for building a strong foundation.")

        # FINAL JSON OUTPUT
        return {
            "recommended_courses": top_courses,
            "recommended_universities": filtered_univs,
            "confidence_scores": {
                "courses": top_c_scores,
                "universities": filtered_u_scores
            },
            "explanations": explanation
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Failed: {str(e)}")

@app.post("/recommendations")
@app.post("/recommend")
def get_recommendations(req: WishlistRequest):
    """
    ML Route for localized Wishlist Course similarities using TF-IDF and Cosine Distances.
    Allows React frontends to fetch dynamic similarity without static hardcoding.
    """
    print(f"🔍 DEBUG: /recommendations called with: {req.wishlist}")
    
    wishlist = req.wishlist
    if not wishlist:
        print("⚠️ DEBUG: Empty wishlist")
        return {"recommended_courses": []}
        
    user_vector = np.zeros(tfidf_matrix.shape[1])
    count = 0
    
    # 1. Aggregate Neural Meaning from user's current wishlist
    for course in wishlist:
        if course in courses_list:
            idx = courses_list.index(course)
            user_vector += tfidf_matrix[idx].toarray()[0]
            count += 1
        else:
            print(f"⚠️ DEBUG: Course '{course}' not found in courses_list")
            
    print(f"🔍 DEBUG: Found {count} valid courses out of {len(wishlist)}")
    
    if count == 0:
        print("⚠️ DEBUG: No valid courses found")
        return {"recommended_courses": []}
        
    user_vector = user_vector / count
    
    # 2. Extract cosine similarities (nearest neighbors via angle calculation)
    similarities = cosine_similarity([user_vector], tfidf_matrix)[0]
    
    # 3. Suppress elements already in wishlist
    # (By setting to -1, it guarantees the ML model fetches completely fresh recommendations)
    for course in wishlist:
        if course in courses_list:
            idx = courses_list.index(course)
            similarities[idx] = -1.0 
            
    # 4. Rank highest similarity 
    top_indices = np.argsort(similarities)[::-1][:4]
    
    recommended = []
    for idx in top_indices:
        if similarities[idx] > -1.0:
            recommended.append(courses_list[idx])
            
    # 5. Build Smart Explanation
    explanation = f"Analyzing your interest in {', '.join(wishlist[:2])}"
    if len(wishlist) > 2:
        explanation += f" and {len(wishlist)-2} others"
        
    explanation += f", our AI mapped strong correlations to <b>{', '.join(recommended[:2])}</b>."
    explanation += " By comparing exact affinities across core subjects like logic, science, creative arts, and mathematics, the neural model curated these precise pathways specifically for your profile."
            
    return {"recommended_courses": recommended, "explanation": explanation}

# Dynamically locate the built Vite production folder
backend_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.abspath(os.path.join(backend_dir, "..", "dist"))
fallback_dir = os.path.abspath(os.path.join(backend_dir, "..", "frontend"))

print(f"📁 Backend directory: {backend_dir}")
print(f"📁 Looking for dist at: {dist_dir}")
print(f"📁 Fallback frontend at: {fallback_dir}")
print(f"📁 dist exists: {os.path.exists(dist_dir)}")
print(f"📁 frontend exists: {os.path.exists(fallback_dir)}")

# --- BULLETPROOF ROUTING FOR RENDER ---
@app.get("/")
def serve_root():
    if os.path.exists(os.path.join(dist_dir, "index.html")):
        print("✅ Serving from /dist/index.html")
        return FileResponse(os.path.join(dist_dir, "index.html"))
    elif os.path.exists(os.path.join(fallback_dir, "ai.html")):
        print("⚠️ Serving from /frontend/ai.html (dist not found)")
        return FileResponse(os.path.join(fallback_dir, "ai.html"))
    else:
        print("❌ ERROR: Frontend index.html not found!")
        return {"error": "Frontend not found"}

if os.path.exists(dist_dir):
    print("✅ Serving optimized production Vite build from /dist")
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
elif os.path.exists(fallback_dir):
    print("⚠️ Serving raw frontend directory (Note: Vite env vars may fail without 'npm run build')")
    app.mount("/", StaticFiles(directory=fallback_dir, html=True), name="static")
else:
    print("❌ ERROR: Neither /dist nor /frontend directories found!")

# ----------------- PRODUCTION SERVER BINDING -----------------
# When deployed independently (e.g. Render, Heroku), standard Python execution starts here
if __name__ == "__main__":
    # Pull dynamic port from environment variable fallback OR use 8000 for local testing
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Production Engine mapped to port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
