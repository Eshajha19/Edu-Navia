/**
 * Connects directly to the Python FastAPI backend to generate True ML Recommendations
 * Uses TF-IDF and Cosine Distance computation on the target vectors.
 */
export async function updateRecommendations(wishlist) {
  const container = document.getElementById("recommendedSection");
  const grid = document.getElementById("recommendedGrid");
  const emptyMsg = document.getElementById("emptyWishlistMsg");
  
  if (!container || !grid || !emptyMsg) return;

  grid.innerHTML = ""; // Clear existing recommendations
  
  // Guard clause against phantom UI array traces ["", null]
  wishlist = wishlist ? wishlist.filter(item => item && item.trim() !== "") : [];

  if (wishlist.length === 0) {
    emptyMsg.style.display = "block";
    grid.style.display = "none";
    return;
  }

  emptyMsg.style.display = "none";
  grid.style.display = "grid"; // Adhere to same courses grid-container framework
  
  try {
    // 1. Fetch ML Similarities from the robust Python Backend (Cosine Similarity)
    const API_BASE = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL || "");
    const endpoint = `${API_BASE}/recommendations`;
    
    console.log("🔗 [COURSES] Connecting to recommendations API:", endpoint);
    console.log("📍 [COURSES] Environment: DEV?", import.meta.env.DEV, "API_URL:", import.meta.env.VITE_API_URL);
    console.log("📤 [COURSES] Sending wishlist:", wishlist);
    
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: wishlist })
    });
    
    console.log("📥 [COURSES] Response status:", response.status);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [COURSES] Backend Recommendation ML Failure", { 
            status: response.status, 
            statusText: response.statusText,
            endpoint: endpoint,
            error: errorText 
        });
        emptyMsg.style.display = "block";
        emptyMsg.textContent = "⚠️ Backend service temporarily unavailable";
        grid.style.display = "none";
        return;
    }
    
    const data = await response.json();
    console.log("✅ [COURSES] API Response:", data);
    const topRecommendations = data.recommended_courses || [];
    const explanation = data.explanation || "";

    // 1.5 Handle empty logic gracefully (e.g. backend failed to map courses)
    if (!topRecommendations.length) {
        grid.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    // 1.8 Inject AI Insight Box dynamically only if insight exists
    if (explanation.trim() !== "") {
        let insightBox = document.getElementById("aiInsightMsg");
        if (!insightBox) {
            insightBox = document.createElement("div");
            insightBox.id = "aiInsightMsg";
            insightBox.style.width = "100%";
            insightBox.style.background = "#eafff5";
            insightBox.style.borderLeft = "5px solid #00c6a7";
            insightBox.style.padding = "20px";
            insightBox.style.marginBottom = "25px";
            insightBox.style.borderRadius = "10px";
            insightBox.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
            insightBox.style.color = "#2c3e50";
            insightBox.style.lineHeight = "1.5";
            insightBox.style.gridColumn = "1 / -1"; // Span across all columns securely
            grid.prepend(insightBox);
        }
        insightBox.innerHTML = `<strong>🤖 AI Insight:</strong><br>${explanation}`;
    }
  
    // 2. Build UI (Inject strictly cloned nodes to assure perfectly identical UI layout & events)
    topRecommendations.forEach(rec => {
      // Pull securely from coursesGrid only
      const originalCard = document.querySelector(`#coursesGrid .card[data-course-name="${rec}"]`);
      if (originalCard) {
        const clone = originalCard.cloneNode(true);
        
        // Since it's cloned, we re-bind inline JS behaviors securely
        const btn = clone.querySelector(".wishlist-btn");
        if (btn) {
          btn.onclick = function(e) { 
            e.stopPropagation(); 
            if(window.toggleWishlist) window.toggleWishlist(this); 
          };
          // Recommended courses are naturally NOT yet wished for mathematically
          btn.textContent = "🤍"; 
        }

        // Re-bind modal popups
        clone.addEventListener("click", (event) => {
          if (
            event.target.classList.contains("wishlist-btn") || 
            event.target.classList.contains("details-btn")
          ) return;
    
          const courseName = clone.dataset.courseName;
          if(window.showCareerPath) window.showCareerPath(courseName); 
        });

        grid.appendChild(clone);
      }
    });
  } catch(err) {
      console.error("❌ AI Recommendation Backend is offline or failed:", {
          error: err.message,
          stack: err.stack,
          cause: err.cause
      });
      if (emptyMsg) {
          emptyMsg.style.display = "block";
          emptyMsg.textContent = "⚠️ AI Recommendations temporarily unavailable. Try refreshing the page.";
      }
      if (grid) {
          grid.style.display = "none";
      }
  }
}
