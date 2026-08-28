/**
 * AI-Powered Content-Based Filtering System for University Recommendations
 * Computes logical similarity vectors synchronously based on user profile.
 */

// Basic Tier NLP logic
function detectTier(name) {
    if(!name) return "Tier 3";
    const n = name.toUpperCase();
    if (["IIT", "AIIMS", "NIT", "IIM", "BITS", "NID", "NIFT", "DELHI UNIVERSITY", "JNU"].some(x => n.includes(x))) return "Tier 1";
    if (["VIT", "SRM", "MANIPAL", "AMITY", "THAPAR", "SYMBIOSIS", "CHRIST"].some(x => n.includes(x))) return "Tier 2";
    return "Tier 3";
}

export function generateUnivRecommendations(allUnivs, wishlist, selectedTier, selectedLocation) {
    const sidebarGrid = document.getElementById("sidebarGrid");
    const emptyMsg = document.getElementById("sidebarEmptyMsg");

    if (!sidebarGrid || !emptyMsg) return;

    if (wishlist.length === 0 && !selectedTier && !selectedLocation) {
        sidebarGrid.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    // 1. Build User Meaning Profile
    const profileLocations = new Set();
    const profileTypes = new Set();
    const profileTiers = new Set();
    let sampleWishlistUniv = null;

    if (selectedLocation) profileLocations.add(selectedLocation.toLowerCase().trim());
    if (selectedTier) profileTiers.add(selectedTier.toLowerCase().trim());

    wishlist.forEach(wName => {
        const u = allUnivs.find(x => x.name === wName);
        if (u) {
            if (u.location) profileLocations.add(u.location.toLowerCase().trim());
            if (u.type) profileTypes.add(u.type.toLowerCase().trim());
            profileTiers.add(detectTier(u.name).toLowerCase());
            sampleWishlistUniv = u.name; // Remember one for explanation string
        }
    });

    // 2. Compute Similarity Scores
    let scores = [];
    allUnivs.forEach(univ => {
        if (wishlist.includes(univ.name)) return; // Exclude cart

        let score = 0;
        let reasons = [];
        
        const uLoc = (univ.location || "").toLowerCase().trim();
        const uType = (univ.type || "").toLowerCase().trim();
        const uTier = detectTier(univ.name).toLowerCase();

        if (profileLocations.has(uLoc) && uLoc) {
            score += 3;
            reasons.push(`matches your preferred region (${univ.location})`);
        }
        if (profileTiers.has(uTier)) {
            score += 2;
            reasons.push(`matches your preference for ${uTier.toUpperCase()} universities`);
        }
        if (profileTypes.has(uType) && uType) {
            score += 1.5;
            reasons.push(`aligns with your interest in ${univ.type} institutes`);
        }

        // Add bonus context if it matches a wishlisted item without full string match
        if (sampleWishlistUniv && score >= 3) {
            reasons.push(`similar structure to ${sampleWishlistUniv}`);
        }

        if (score > 0) {
            scores.push({
                univ: univ,
                score: score,
                reason: reasons.length > 0 ? reasons[0] : "AI predicted affinity"
            });
        }
    });

    // 3. Rank Options
    scores.sort((a, b) => b.score - a.score);
    // Return ALL possible recommendations that have at least a moderate relevance score
    // (Filtering out ultra-low score noise, but keeping every definitively matched university)
    const allValidRecommendations = scores.filter(s => s.score >= 1.5);

    // 4. Handle Edge Cases
    if (allValidRecommendations.length === 0) {
        sidebarGrid.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    // 5. Build Smooth Sidebar UI
    sidebarGrid.style.display = "flex";
    emptyMsg.style.display = "none";
    sidebarGrid.style.opacity = "0"; // for fade animation
    sidebarGrid.innerHTML = "";

    allValidRecommendations.forEach(rec => {
        // Build mini card UI structurally identical to main UI but smaller
        const mcard = document.createElement("div");
        mcard.className = "university-card mini-univ-card";
        mcard.style.padding = "15px";
        mcard.style.background = "#fff";
        mcard.style.border = "1px solid #eee";
        mcard.style.borderRadius = "10px";
        mcard.style.boxShadow = "0 8px 16px rgba(0,0,0,0.04)";
        mcard.style.borderLeft = "5px solid #00c6a7";
        mcard.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
        mcard.style.position = "relative";
        mcard.style.overflow = "hidden";

        const isWished = wishlist.includes(rec.univ.name);
        const iconFill = isWished ? "#ff4b4b" : "none";
        const iconStroke = isWished ? "#ff4b4b" : "#ccc";

        const btnHtml = `<button class="univ-wishlist-btn" data-univ-name="${rec.univ.name.replace(/"/g, '&quot;')}" onclick="window.handleUnivWishlist(this, '${rec.univ.name.replace(/'/g, "\\'")}')" style="position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.95); border:1px solid #eee; border-radius:50%; width:32px; height:32px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.08); z-index:2; transition: transform 0.2s; display:flex; align-items:center; justify-content:center; color:#ccc;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${iconFill}" stroke="${iconStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>`;
        
        mcard.innerHTML = `
            ${btnHtml}
            <div style="padding-right: 30px;">
                <h4 style="margin: 0 0 8px 0; font-size: 1.05rem; font-weight: 800; color: #1a1a2e; line-height: 1.3;">${rec.univ.name}</h4>
                <div style="font-size: 0.8rem; font-weight: 600; color: #888; margin-bottom: 12px; display:flex; align-items:center; gap:8px;">
                    <span style="text-transform: uppercase;">${rec.univ.location || 'Unknown'}</span>
                    <span style="color:#d1d5db;">&bull;</span>
                    <span style="color: #00c6a7;">${rec.univ.type || 'Institute'}</span>
                </div>
            </div>
            <div style="font-size: 0.85rem; color: #334155; font-weight: 500; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top:5px; line-height: 1.5;">
                <strong style="color: #0f172a; font-size: 0.75rem; text-transform:uppercase; letter-spacing: 0.5px; display:block; margin-bottom: 4px;">Reasoning</strong>
                ${rec.reason}
            </div>
        `;
        
        // Add hover CSS via JS to avoid modifying global CSS if not strictly necessary
        mcard.onmouseenter = () => { mcard.style.transform = "translateY(-5px)"; mcard.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)"; };
        mcard.onmouseleave = () => { mcard.style.transform = "translateY(0)"; mcard.style.boxShadow = "0 8px 16px rgba(0,0,0,0.04)"; };

        sidebarGrid.appendChild(mcard);
    });

    // Smooth fade-in
    setTimeout(() => { sidebarGrid.style.transition = "opacity 0.4s ease"; sidebarGrid.style.opacity = "1"; }, 50);
}
