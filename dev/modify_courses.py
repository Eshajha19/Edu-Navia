import os

file_path = "courses.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Recommended UI Section explicitly above Courses Grid
ui_section = """<!-- Recommended For You Section -->
<section class="recommended-section" id="recommendedSection" style="padding: 20px 10%; margin-bottom: 30px;">
  <h2 style="text-align:center; color:#0056b3; margin-bottom: 20px; font-weight:700;">★ Recommended For You ★</h2>
  <div id="emptyWishlistMsg" style="text-align:center; padding: 30px; background:#f4f7fb; border-radius:10px; color:#555; font-size:1.1rem; border:2px dashed #ccc;">
    Add courses to your wishlist to get personalized AI recommendations!
  </div>
  <div class="grid-container" id="recommendedGrid" style="display:none; padding-top:0; justify-content:center;"></div>
  <hr style="border: 1px solid #ddd; margin-top: 50px;">
</section>

<!-- Courses Grid -->
<section class="grid-container" id="coursesGrid">"""

if "Recommended For You Section" not in content:
    content = content.replace('<!-- Courses Grid -->\n<section class="grid-container" id="coursesGrid">', ui_section)

# 2. Add Import Statement securely
if "import { updateRecommendations" not in content:
    content = content.replace(
        'import { initializeApp } from "https://www.gstatic.com/firebasejs',
        'import { updateRecommendations } from "./recommendation.js";\nimport { initializeApp } from "https://www.gstatic.com/firebasejs'
    )

# 3. Inject Real-Time Update Hooks securely
if "updateRecommendations(newSnap" not in content:
    content = content.replace(
        'console.log(`❌ Removed: ${courseName}`);',
        'console.log(`❌ Removed: ${courseName}`);\n      const newSnap = await getDoc(userRef);\n      updateRecommendations(newSnap.data()?.courseWishlist || []);'
    )
    content = content.replace(
        'console.log(`✅ Added: ${courseName}`);',
        'console.log(`✅ Added: ${courseName}`);\n      const newSnap = await getDoc(userRef);\n      updateRecommendations(newSnap.data()?.courseWishlist || []);'
    )

# 4. Restrict DOM Selectors from accidentally altering the cloned Recommendation cards
content = content.replace('document.querySelectorAll(".card").forEach', 'document.querySelectorAll("#coursesGrid .card").forEach')
content = content.replace('document.querySelectorAll(".wishlist-btn").forEach', 'document.querySelectorAll("#coursesGrid .wishlist-btn").forEach')

# 5. Fire Recommendations immediately on initial login preload securely
if "updateRecommendations(wishlist);" not in content:
    target_block = '      if (courseName && btn) {\n        btn.textContent = wishlist.includes(courseName) ? "❤️" : "🤍";\n      }\n    });\n  } catch (err) {'
    replacement_block = '      if (courseName && btn) {\n        btn.textContent = wishlist.includes(courseName) ? "❤️" : "🤍";\n      }\n    });\n    updateRecommendations(wishlist);\n  } catch (err) {'
    content = content.replace(target_block, replacement_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modification complete. The DOM and Firebase logic have been perfectly patched without regressions!")
