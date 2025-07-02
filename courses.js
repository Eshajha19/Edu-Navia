// Typing Effect
const text = "Explore University Courses with Edu Navia";
let index = 0;
let isDeleting = false;
const speed = 100;
const pause = 2000;
const typewriter = document.getElementById("typewriter");

function typeText() {
  if (!typewriter) return;

  if (!isDeleting && index <= text.length) {
    typewriter.textContent = text.substring(0, index++);
    setTimeout(typeText, speed);
  } else if (isDeleting && index >= 0) {
    typewriter.textContent = text.substring(0, index--);
    setTimeout(typeText, speed / 2);
  } else if (!isDeleting && index > text.length) {
    isDeleting = true;
    setTimeout(typeText, pause);
  } else {
    isDeleting = false;
    setTimeout(typeText, speed);
  }
}

document.addEventListener("DOMContentLoaded", typeText);

// Course Search
function searchCourses() {
  const input = document.getElementById("courseSearch").value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  const noResults = document.getElementById("noResults");
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const desc = card.querySelector("p").textContent.toLowerCase();

    if (title.includes(input) || desc.includes(input)) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show or hide the "No Results Found" message based on visible cards count
  noResults.style.display = visibleCount === 0 ? "block" : "none";
}
