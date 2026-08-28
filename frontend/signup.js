// signup.js

// 🔧 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
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
// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// 🎯 DOM Elements
const signupForm = document.getElementById("signup-form");
const fullName = document.getElementById("full-name");
const emailInput = document.getElementById("signup-email");
const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("signup-confirm");
const googleBtn = document.getElementById("google");

// Modals
const welcomeModal = document.getElementById("welcomeModal");
const closeModal = document.getElementById("closeModal");
const errorModal = document.getElementById("errorModal");
const errorClose = document.getElementById("errorClose");

// --- Helper: create Firestore doc ID from full name ---
function createDocIdFromName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')          // spaces → underscores
    .replace(/[^a-z0-9_]/g, '');  // remove non-alphanumeric/underscore chars
}

// --- Modal close listeners (only once) ---
closeModal.addEventListener("click", () => {
  welcomeModal.classList.remove("show");
  setTimeout(() => {
    welcomeModal.classList.add("hidden");
    window.location.href = "index.html";
  }, 250);
});

errorClose.addEventListener("click", () => {
  errorModal.classList.remove("show");
  setTimeout(() => {
    errorModal.classList.add("hidden");
  }, 250);
});

// ✅ Show Welcome Modal
function showWelcomeModal() {
  welcomeModal.classList.remove("hidden");
  setTimeout(() => welcomeModal.classList.add("show"), 10);
}

// ✅ Show Existing Account Modal
function showExistingUserModal(callback) {
  errorModal.classList.remove("hidden");
  setTimeout(() => errorModal.classList.add("show"), 10);

  if (callback) callback();
}

// ✅ Handle Email Signup
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = fullName.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    // Replace alert with Swal popup
    Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'Passwords do not match. Please try again.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
    return;
  }

  try {
    // Create user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);

    // Generate Firestore doc ID from full name + first 6 chars of UID for uniqueness
    // NEW (only name-based doc ID)
const docId = createDocIdFromName(name);

    console.log("Saving user doc with ID:", docId);

   await setDoc(doc(db, "users", docId), {
  name: name,
  email: email,
  createdAt: new Date()
});


    showWelcomeModal();
  } catch (error) {
    console.error("Signup failed:", error.message);
    if (error.code === "auth/email-already-in-use") {
      showExistingUserModal();
    } else {
      // Replace alert with Swal popup for other errors
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  }
});

// ✅ Handle Google Sign-in
googleBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in success:", result.user);

    const info = getAdditionalUserInfo(result);

    // Get displayName or fallback
    const displayName = result.user.displayName || "user";

    // Generate Firestore doc ID from displayName + first 6 chars of UID for uniqueness
    const docId = createDocIdFromName(displayName);

    console.log("Google user doc ID:", docId);

    if (info?.isNewUser) {
      // Save new user data to Firestore
      await setDoc(doc(db, "users", docId), {
  name: displayName,
  email: result.user.email,
  createdAt: new Date()
});


      showWelcomeModal();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Account Already Exists',
        text: 'Please log in or sign up with a new account.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    console.error("Google sign-in error:", error.code, error.message);

    if (error.code === "auth/account-exists-with-different-credential") {
      showExistingUserModal();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-in Failed',
        text: error.message,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  }
});

// Optional welcome popup on page load
window.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('welcomePopup');
  const closeBtn = document.getElementById('closePopupBtn');

  // Show popup after 1 second
  setTimeout(() => {
    popup.classList.add('show');
  }, 1000);

  // Close popup on button click
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('show');
  });
});
