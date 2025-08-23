 import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let currentUser = null;

// Toast function
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadQuestions();
  } else {
    document.getElementById("loginPopup").style.display = "flex";
  }
});

// Load Questions
function loadQuestions() {
  const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));
  const list = document.getElementById("questionsList");

  onSnapshot(q, (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;

      const card = document.createElement("div");
      card.className = "question-card";

      let content = `
        <div class="category-badge">${data.category || "General"}</div>
        <h3>${data.question || "Untitled Question"}</h3>
        <p><strong>Asked by:</strong> ${data.askedBy || "Anonymous"}</p>
      `;

      // Show delete question button to asker
      if (
        currentUser.email === data.askedBy ||
        currentUser.displayName === data.askedBy
      ) {
        content += `<button onclick="deleteQuestion('${docId}')">🗑️ Delete Question</button>`;
      }

      if (data.answer) {
        content += `
          <p><strong>Answer:</strong> ${data.answer}</p>
          <p><em>Answered by: ${data.answeredBy || "Anonymous"}</em></p>
        `;

        if (
          currentUser.email === data.answeredBy ||
          currentUser.displayName === data.answeredBy
        ) {
          content += `<button onclick="deleteAnswer('${docId}')">🗑️ Delete Answer</button>`;
        }
      } else {
        const isSenior = currentUser.email.endsWith(".edu"); // customize this logic if needed
        if (isSenior) {
          content += `
            <textarea id="answer-${docId}" placeholder="Write your answer..." rows="3"></textarea>
            <button onclick="submitAnswer('${docId}')">Submit Answer</button>
          `;
        } else {
          content += `<p><em>Awaiting senior response...</em></p>`;
        }
      }

      card.innerHTML = content;
      list.appendChild(card);
    });
  });
}

// Submit Question
window.submitQuestion = async () => {
  const questionInput = document.getElementById("question");
  const question = questionInput.value.trim();

  const category = document.getElementById("category").value; // ✅ GET category

  if (!question) return showToast("Please enter a question.");
  if (!currentUser) return showToast("You must be logged in to submit a question.");

  const askedBy = currentUser.displayName || currentUser.email || "Anonymous";

  // Create unique doc ID (or use addDoc if you want Firestore to auto-generate one)
  const docId = question.toLowerCase().replace(/[.#$/\[\]\s]/g, "_");

  const docRef = doc(db, "questions", docId); // ✅ DEFINE docRef

  try {
    await setDoc(docRef, {
      question: question,
      askedBy: askedBy,
      userId: currentUser.uid,
      timestamp: serverTimestamp(),
      category: category // ✅ SAVE category correctly
    });

    questionInput.value = "";
    showToast("Question submitted!");
  } catch (error) {
    console.error("Error submitting question:", error);
    showToast("Submission failed.");
  }
};


// Submit Answer
window.submitAnswer = async (id) => {
  const answerField = document.getElementById(`answer-${id}`);
  if (!answerField) return;
  const answer = answerField.value.trim();
  if (!answer) return Swal.fire({
  icon: 'warning',
  title: 'Missing Answer!',
  text: 'Please type something before submitting your answer.',
  background: '#fdfdfd',
  backdrop: `rgba(0,0,123,0.4)`,
  confirmButtonColor: '#007bff',
  confirmButtonText: 'Okay!',
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
});



  const answerBy = currentUser.displayName || currentUser.email;

  try {
    await updateDoc(doc(db, "questions", id), {
      answer,
      answeredBy: answerBy,
    });

    showToast("Answer submitted!");
  } catch (error) {
    console.error("Error submitting answer:", error);
    showToast("Failed to submit answer.");
  }
};

// Delete Question
window.deleteQuestion = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this question?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Your delete logic here
        await deleteDoc(doc(db, "questions", id)); // example
        Swal.fire(
          'Deleted!',
          'The question has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'There was a problem deleting the question.',
          'error'
        );
        console.error("Delete error:", error);
      }
    }
  });

  try {
    await deleteDoc(doc(db, "questions", id));
    showToast("Question deleted!");
  } catch (err) {
    console.error("Error deleting question:", err);
    showToast("Error deleting question.");
  }
};

// Delete Answer
window.deleteAnswer = async (id) => {
  Swal.fire({
    title: 'Delete Answer?',
    text: 'Are you sure you want to delete this answer?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      await updateDoc(doc(db, "questions", id), {
        answer: "",
        answeredBy: "",
      });

      Swal.fire({
        title: 'Deleted!',
        text: 'The answer has been removed.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Optional: call a UI update or reload the answers
      // loadAnswers();
    } catch (err) {
      console.error("Error deleting answer:", err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the answer.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  });
};

// Toggle menu
window.toggleMenu = () => {
  document.getElementById("navLinks").classList.toggle("show");
};
document.getElementById("loginNowBtn").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header.navbar');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

  });
