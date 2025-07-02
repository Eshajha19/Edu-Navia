document.addEventListener("DOMContentLoaded", () => {
  // ==================== Typing Effect ====================
  const typingElement = document.getElementById("typingText");
  const text = "Shape Your Academic Future";
  let index = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let erasingSpeed = 50;
  let delay = 1500;

  function typeEffect() {
    if (!typingElement) return;

    if (!isDeleting && index < text.length) {
      typingElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeEffect, typingSpeed);
    } else if (!isDeleting && index === text.length) {
      isDeleting = true;
      setTimeout(typeEffect, delay);
    } else if (isDeleting && index > 0) {
      typingElement.textContent = text.substring(0, index - 1);
      index--;
      setTimeout(typeEffect, erasingSpeed);
    } else if (isDeleting && index === 0) {
      isDeleting = false;
      setTimeout(typeEffect, delay);
    }
  }

  typeEffect();

  // ==================== Card Slider ====================
  const cardsData = [
    { img: "engineering.jpeg", title: "Study Engineering" },
    { img: "law.jpeg", title: "Study Law" },
    { img: "economics.jpeg", title: "Study Economics" },
    { img: "psychology.jpeg", title: "Study Psychology" },
    { img: "liberal arts.png", title: "Study Liberal Arts" },
    { img: "fine arts.png", title: "Study Fine Arts" },
    { img: "finance.png", title: "Study Finance" },
    { img: "architecture.png", title: "Study Architecture" },
    { img: "computer science.png", title: "Study Computer Science" },
    { img: "medical.png", title: "Study Medical" }
  ];

  const slider = document.getElementById("cardSlider");
  let slideIndex = 0;

  function createCards() {
    cardsData.forEach(data => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${data.img}" alt="${data.title}" onerror="this.src='https://via.placeholder.com/270x160?text=Image+Missing'">
        <div class="card-text">${data.title}</div>
      `;
      slider.appendChild(card);
    });
  }

  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width < 500) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  }

  function showSlides(n) {
  const card = slider.querySelector(".card");
  if (!card) return;

  const cardWidth = card.offsetWidth +
    parseInt(getComputedStyle(card).marginLeft) +
    parseInt(getComputedStyle(card).marginRight);

  const visibleCards = getVisibleCardsCount();
  const maxIndex = cardsData.length - visibleCards;

  // Wrap-around logic
  if (n > maxIndex) {
    slideIndex = 0; // loop back to start
  } else if (n < 0) {
    slideIndex = maxIndex; // go to end
  } else {
    slideIndex = n;
  }

  slider.style.transform = `translateX(${-slideIndex * cardWidth}px)`;
}


  createCards();
  showSlides(0);
  document.getElementById("prevBtn").addEventListener("click", () => showSlides(slideIndex - 1));
  document.getElementById("nextBtn").addEventListener("click", () => showSlides(slideIndex + 1));
  window.addEventListener("resize", () => showSlides(slideIndex));

  // ==================== Rating Modal ====================
  const rateBtn = document.getElementById("rateUsBtn");
  const modal = document.getElementById("ratingModal");
  const closeBtn = document.getElementById("closeRatingModal");

  if (rateBtn && modal && closeBtn) {
    rateBtn.onclick = () => {
      modal.style.display = "flex";
    };

    closeBtn.onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    // Auto open modal after 10s once per session
    if (!sessionStorage.getItem("ratingPopupShown")) {
      setTimeout(() => {
        modal.style.display = "flex";
        sessionStorage.setItem("ratingPopupShown", "true");
      }, 10000);
    }
  } else {
    console.error("Modal or button elements not found.");
  }
});
