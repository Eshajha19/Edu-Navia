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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  const firebaseConfig = {
      // your firebase config
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing! Check your .env file.");
  }



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let currentUser = null;
let questions = [];

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
  onSnapshot(q, (snapshot) => {
    questions = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    renderQuestions();
  });
}

function renderQuestions() {
  const list = document.getElementById("questionsList");
  const filter = document.getElementById("universityFilter").value.trim().toLocaleLowerCase();
  list.replaceChildren();

  const visibleQuestions = questions.filter(data => !filter || `${data.university || ""} ${data.program || ""} ${data.question || ""}`.toLocaleLowerCase().includes(filter));
  visibleQuestions.forEach(data => {
    const card = document.createElement("article");
    card.className = "question-card";

    const category = document.createElement("span");
    category.className = "category-badge";
    category.textContent = data.category || "General";
    card.append(category);

    if (data.university) {
      const campus = document.createElement("span");
      campus.className = "campus-tag";
      campus.textContent = `Campus: ${data.university}`;
      card.append(campus);
    }
    if (data.program) {
      const program = document.createElement("span");
      program.className = "campus-tag";
      program.textContent = data.program;
      card.append(program);
    }

    const question = document.createElement("h3");
    question.textContent = data.question || "Untitled Question";
    card.append(question);

    const asker = document.createElement("p");
    asker.className = "question-meta";
    asker.textContent = `Asked by ${data.askedBy || "Anonymous"}${data.askedByRole ? ` · ${data.askedByRole} (self-reported)` : ""}`;
    card.append(asker);

    if (data.userId === currentUser.uid || currentUser.email === data.askedBy || currentUser.displayName === data.askedBy) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete question";
      deleteButton.addEventListener("click", () => window.deleteQuestion(data.id));
      card.append(deleteButton);
    }

    if (data.answer) {
      const answer = document.createElement("p");
      answer.append(document.createElement("strong"), document.createTextNode(` ${data.answer}`));
      answer.firstChild.textContent = "Answer:";
      card.append(answer);
      const answerMeta = document.createElement("p");
      answerMeta.className = "question-meta";
      answerMeta.textContent = `Answered by ${data.answeredBy || "Community member"}${data.answeredByRole ? ` · ${data.answeredByRole} (self-reported)` : ""}`;
      card.append(answerMeta);
      if (data.answerUserId === currentUser.uid || currentUser.email === data.answeredBy || currentUser.displayName === data.answeredBy) {
        const deleteAnswerButton = document.createElement("button");
        deleteAnswerButton.type = "button";
        deleteAnswerButton.textContent = "Delete answer";
        deleteAnswerButton.addEventListener("click", () => window.deleteAnswer(data.id));
        card.append(deleteAnswerButton);
      }
    } else {
      const answerLabel = document.createElement("label");
      answerLabel.textContent = "Your campus connection to this answer";
      const answerRole = document.createElement("select");
      answerRole.id = `answer-affiliation-${data.id}`;
      ["Applicant", "Current student", "Graduate", "Other"].forEach(role => answerRole.add(new Option(role, role)));
      answerLabel.append(answerRole);
      const answerField = document.createElement("textarea");
      answerField.id = `answer-${data.id}`;
      answerField.maxLength = 1200;
      answerField.rows = 3;
      answerField.placeholder = "Share a helpful answer";
      const answerButton = document.createElement("button");
      answerButton.type = "button";
      answerButton.textContent = "Submit answer";
      answerButton.addEventListener("click", () => window.submitAnswer(data.id));
      card.append(answerLabel, answerField, answerButton);
    }
    list.append(card);
  });
}

document.getElementById("universityFilter").addEventListener("input", renderQuestions);

// Submit Question
window.submitQuestion = async () => {
  const questionInput = document.getElementById("question");
  const question = questionInput.value.trim();
  const category = document.getElementById("category").value;
  const university = document.getElementById("university").value.trim();
  const program = document.getElementById("program").value.trim();
  const askedByRole = document.getElementById("askerAffiliation").value;

  if (!question) return showToast("Please enter a question.");
  if (question.length > 1200) return showToast("Keep your question under 1,200 characters.");
  if (!currentUser) return showToast("You must be logged in to submit a question.");

  const askedBy = currentUser.displayName || currentUser.email || "Anonymous";

  try {
    await addDoc(collection(db, "questions"), {
      question,
      askedBy,
      userId: currentUser.uid,
      timestamp: serverTimestamp(),
      category,
      university,
      program,
      askedByRole
    });

    questionInput.value = "";
    document.getElementById("university").value = "";
    document.getElementById("program").value = "";
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
  const answerRole = document.getElementById(`answer-affiliation-${id}`)?.value || "Other";

  try {
    await updateDoc(doc(db, "questions", id), {
      answer,
      answeredBy: answerBy,
      answerUserId: currentUser.uid,
      answeredByRole: answerRole,
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
    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "questions", id));

      Swal.fire({
        title: 'Deleted!',
        text: 'The question has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      showToast("Question deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire(
        'Error!',
        'There was a problem deleting the question.',
        'error'
      );
    }
  });
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