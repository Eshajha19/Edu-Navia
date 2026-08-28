import os
import re

file_path = "p.html"
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update Layout (Sidebar Injection)
old_layout = """<!-- University Grid -->
  <div class="universities-grid" id="universitiesGrid"></div>

  <!-- No Results Message -->
  <p id="noResultsMsg" style="display: none; text-align: center; font-weight: bold; margin-top: 20px;">
    No results found.
  </p>"""

new_layout = """<!-- Layout Wrapper for Main Grid + Sidebar -->
<div class="page-layout" style="display: flex; gap: 30px; max-width: 1200px; margin: 0 auto; padding: 20px; align-items: flex-start; flex-wrap: wrap;">
   <!-- Main content -->
   <div class="main-content" style="flex: 2.5; min-width: 60%;">
       <div class="universities-grid" id="universitiesGrid"></div>
       <p id="noResultsMsg" style="display: none; text-align: center; font-weight: bold; margin-top: 20px;">
         No results found. There are no universities matching this filter profile.
       </p>
   </div>

   <!-- Right Sidebar AI Recommendation Engine -->
   <aside class="sidebar" id="universitySidebar" style="flex: 1; min-width: 320px; background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: sticky; top: 80px;">
       <h3 style="margin-top:0; color:#0056b3; border-bottom: 2px solid #00c6a7; padding-bottom: 12px; font-weight: 700; font-size: 1.3rem;">★ Recommended Universities ★</h3>
       <div id="sidebarEmptyMsg" style="text-align:center; color:#777; padding: 20px 0; font-size: 0.95rem; line-height: 1.6; background: #fdfdfd; border-radius: 8px; border: 2px dashed #ddd;">
           <span style="font-size:2rem;display:block;margin-bottom:10px;">🤖</span>
           Select filter preferences or wishlist universities to get your AI-powered personalized recommendations directly sourced from your behavior!
       </div>
       <div id="sidebarGrid" style="display:none; flex-direction: column; gap: 15px; margin-top: 15px;"></div>
   </aside>
</div>"""

if "page-layout" not in html:
    html = html.replace(old_layout, new_layout)
    html = html.replace('<!-- University Grid -->\n  <div class="universities-grid" id="universitiesGrid"></div>\n\n  <!-- No Results Message -->\n  <p id="noResultsMsg" style="display: none; text-align: center; font-weight: bold; margin-top: 20px;">\n    No results found.\n  </p>', new_layout)

# 2. Inject Filters into Search bar explicitly
search_container_old = """<div class="search-container">
  <input type="text" id="searchInput" placeholder="Search colleges (e.g., IIT, Delhi)" />
  <button id="voiceBtn" title="Speak to search">🎤</button>
  <button id="searchBtn">Search</button>
</div>"""

search_container_new = """<div class="search-container" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-bottom: 20px;">
  <input type="text" id="searchInput" placeholder="Search colleges (e.g., IIT, Delhi)" style="flex:1; min-width: 250px;"/>
  <select id="tierFilter" style="padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 1rem; cursor:pointer;">
    <option value="">🎯 All Tiers</option>
    <option value="Tier 1">★ Elite (Tier 1)</option>
    <option value="Tier 2">★ Premium (Tier 2)</option>
    <option value="Tier 3">★ Foundation (Tier 3)</option>
  </select>
  <button id="voiceBtn" title="Speak to search" style="border-radius:6px;">🎤</button>
  <button id="searchBtn" style="border-radius:6px;">🔍 Search</button>
</div>"""

if "tierFilter" not in html:
    html = html.replace(search_container_old, search_container_new)

# 3. Add Module Imports and Init logic safely
import_statement = """import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { univWishlist } from "./wishlistHandler.js";
  import { generateUnivRecommendations } from "./universityRecommendation.js";
  
  window.univWishlistStore = univWishlist.getWishlist();
  univWishlist.subscribe((wishlist) => {
      window.univWishlistStore = wishlist;
      const tierFilter = document.getElementById("tierFilter");
      generateUnivRecommendations(allUniversities, wishlist, tierFilter ? tierFilter.value : "", document.getElementById("searchInput").value);
  });
"""
if "import { univWishlist }" not in html:
    html = html.replace('import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";', import_statement)

# 4. Modify University Card Renderer
old_card_renderer = """data.forEach(univ => {
        html += `
          <div class="university-card">
            <img src="${univ.image}" alt="${univ.name}" loading="lazy" />"""

new_card_renderer = """data.forEach(univ => {
        const isWished = window.univWishlistStore ? window.univWishlistStore.includes(univ.name) : false;
        const heart = isWished ? "❤️" : "🤍";

        html += `
          <div class="university-card" style="position:relative;">
            <button class="univ-wishlist-btn" onclick="window.handleUnivWishlist(this, '${univ.name.replace(/'/g, "&#39;")}')" data-univ-name="${univ.name.replace(/'/g, "&#39;")}" style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:42px; height:42px; font-size:1.6rem; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 3px 10px rgba(0,0,0,0.15); z-index:2; transition: transform 0.2s;">${heart}</button>
            <img src="${univ.image}" alt="${univ.name}" loading="lazy" />"""

if "window.handleUnivWishlist(this" not in html:
    html = html.replace(old_card_renderer, new_card_renderer)

# 5. Connect Search & Filters to Recommendations logic
filter_logic_injection = """  function applyFilters() {
    const value = searchInput.value.toLowerCase();
    const tierFilter = document.getElementById("tierFilter");
    const selectedTier = tierFilter ? tierFilter.value : "";

    const filtered = allUniversities.filter(u => {
      const matchSearch = (u.name && u.name.toLowerCase().includes(value)) || (u.location && u.location.toLowerCase().includes(value));
      
      let tierMatch = true;
      if (selectedTier) {
         const n = (u.name || "").toUpperCase();
         let uTier = "Tier 3";
         if (["IIT", "AIIMS", "NIT", "IIM", "BITS", "NID", "NIFT", "DELHI UNIVERSITY", "JNU"].some(x => n.includes(x))) uTier = "Tier 1";
         else if (["VIT", "SRM", "MANIPAL", "AMITY", "THAPAR", "SYMBIOSIS", "CHRIST"].some(x => n.includes(x))) uTier = "Tier 2";
         
         if (uTier !== selectedTier) tierMatch = false;
      }
      return matchSearch && tierMatch;
    });
    renderUniversities(filtered);
    
    // Explicitly update Recommendations Engine!
    if (window.univWishlistStore) {
        generateUnivRecommendations(allUniversities, window.univWishlistStore, selectedTier, value);
    }
  }

  const tierFilter = document.getElementById("tierFilter");
  if(tierFilter) tierFilter.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", debounce(applyFilters, 300));
"""

# Suppress original searchInput block and replace with robust applyFilters mechanism
if "function applyFilters()" not in html:
    html = re.sub(r'searchInput\.addEventListener\("input", debounce\(.*?\}, 300\)\);', filter_logic_injection, html, flags=re.DOTALL)
    
if "generateUnivRecommendations(allUniversities" not in html:
    # also call on load finish
    html = html.replace('renderUniversities(allUniversities);', 'renderUniversities(allUniversities);\n      if(window.univWishlistStore) generateUnivRecommendations(allUniversities, window.univWishlistStore, "", "");')
    

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Universities Page intelligently transformed with ML Sidebar.")
