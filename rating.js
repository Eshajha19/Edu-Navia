// ✅ Replace with your Firebase config
const firebaseConfig = {
  
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const categories = [
  "Universities", "Courses", "Support", "Personality Test",
  "University Finder", "Exam Info", "Consulting", "Exam Tracker"
];

// Inject stars and feedback areas
const container = document.getElementById("rating-sections");
categories.forEach(category => {
  const div = document.createElement("div");
  div.className = "section";
  div.innerHTML = `
    <label>${category}</label>
    <div class="stars" data-category="${category}">
      ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-value="${i}">&#9733;</span>`).join('')}
    </div>
    <textarea data-category="${category}" placeholder="Feedback for ${category}"></textarea>
  `;
  container.appendChild(div);
});

// Star rating logic
document.addEventListener("click", e => {
  if (e.target.classList.contains("star")) {
    const stars = e.target.parentElement.querySelectorAll(".star");
    const value = parseInt(e.target.getAttribute("data-value"));
    stars.forEach((star, i) => star.classList.toggle("selected", i < value));
    e.target.parentElement.setAttribute("data-rating", value);
  }
});

// Modal logic
const customModal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalInput = document.getElementById("userNameInput");
const modalCancel = document.getElementById("modalCancel");
const modalOk = document.getElementById("modalOk");

function showModal({ title, message, askName = false, onConfirm }) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  if (askName) {
    modalInput.style.display = "block";
    modalCancel.style.display = "inline-block";
  } else {
    modalInput.style.display = "none";
    modalCancel.style.display = "none";
  }

  customModal.style.display = "flex";

  // Handle cancel
  modalCancel.onclick = () => {
    customModal.style.display = "none";
  };

  // Handle OK
  modalOk.onclick = () => {
    if (askName) {
      const userName = modalInput.value.trim();
      if (!userName) {
        alert("Name is required.");
        return;
      }
      onConfirm(userName);
    } else {
      customModal.style.display = "none";
    }
  };
}

// Submit button logic
let cachedData = {};

document.getElementById("submitAllBtn").onclick = () => {
  const ratingData = {};
  let allFilled = true;

  categories.forEach(category => {
    const stars = document.querySelector(`.stars[data-category="${category}"]`);
    const rating = parseInt(stars.getAttribute("data-rating")) || 0;
    const feedback = document.querySelector(`textarea[data-category="${category}"]`).value.trim();
    if (rating === 0) allFilled = false;

    ratingData[`${category}_rating`] = rating;
    ratingData[`${category}_feedback`] = feedback;
  });

  if (!allFilled) {
    showModal({ title: "Incomplete", message: "⚠️ Please rate all categories." });
    return;
  }

  // Save for now
  cachedData = ratingData;

  showModal({
    title: "Almost Done",
    message: "Please enter your name to submit your ratings.",
    askName: true,
    onConfirm: async (userName) => {
      cachedData.timestamp = new Date();
      try {
        await db.collection("ratings").doc(userName).set(cachedData);
        customModal.style.display = "none";
        document.getElementById("submitMsg").classList.remove("hidden");
        modalInput.value = "";
        showModal({ title: "Success", message: "✅ Your rating has been saved!" });
      } catch (err) {
        showModal({ title: "Error", message: "❌ " + err.message });
      }
    }
  });
};
