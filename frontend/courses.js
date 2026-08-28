// ======================== Typing Effect ========================
document.addEventListener("DOMContentLoaded", () => {
  const text = "Explore University Courses with Edu Navia";
  const typewriter = document.getElementById("typewriter");
  let index = 0;
  let isDeleting = false;
  const speed = 100;
  const pause = 2000;

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

  typeText();
});

// ======================== Search Courses ========================
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

  noResults.style.display = visibleCount === 0 ? "block" : "none";
}

// ======================== Typing Triggers Search ========================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("courseSearch");
  if (searchInput) {
    searchInput.addEventListener("input", searchCourses); // ✅ live typing works
  }
});

// ======================== Voice Search ========================
document.addEventListener("DOMContentLoaded", () => {
  const voiceBtn = document.getElementById("voiceBtn");
  const courseInput = document.getElementById("courseSearch");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && voiceBtn && courseInput) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
      recognition.start();
      voiceBtn.innerText = "🎙️ Listening...";
    });

    recognition.onresult = (event) => {
      const rawTranscript = event.results[0][0].transcript.toLowerCase().trim();
      const transcript = rawTranscript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");

      courseInput.value = transcript;
      courseInput.dispatchEvent(new Event("input")); // ✅ triggers the input listener
      voiceBtn.innerText = "🎤";
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      voiceBtn.innerText = "🎤";
    };

    recognition.onend = () => {
      voiceBtn.innerText = "🎤";
    };
  } else {
    console.warn("SpeechRecognition not supported or elements missing.");
    if (voiceBtn) voiceBtn.disabled = true;
  }
});

// ⬅️ At the bottom of your courses.js file
window.searchCourses = function () {
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

  noResults.style.display = visibleCount === 0 ? "block" : "none";
};
const toggleButton = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }

    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });