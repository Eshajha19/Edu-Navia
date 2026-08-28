// Firebase v11.9.0 imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";


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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔧 DOM elements
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginError = document.getElementById("error");
const loginSuccess = document.getElementById("success");
const loginSpinner = document.getElementById("spinner");
const togglePasswordBtn = document.querySelector(".toggle-password");
const googleLoginBtn = document.querySelector(".google-btn");
const forgotLink = document.getElementById("forgot-password");

// Reset password form
const resetForm = document.getElementById("reset-password-form");
const resetEmail = document.getElementById("reset-email");
const sendResetLinkBtn = document.getElementById("send-reset-link");
const resetMessage = document.getElementById("reset-message");
const backToLoginLink = document.getElementById("back-to-login");

// 🌗 Toggle dark mode
window.toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

// 👁️ Toggle password visibility
window.togglePassword = () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
};

// 🔄 Switch to reset password form
forgotLink?.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  resetForm.classList.remove("hidden");
});

// 🔄 Switch back to login form
backToLoginLink?.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// ✉️ Send password reset email
sendResetLinkBtn?.addEventListener("click", () => {
  const email = resetEmail.value.trim();
  if (!email) {
    resetMessage.textContent = "Please enter your email.";
    resetMessage.style.color = "red";
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      resetMessage.textContent = "Password reset link sent! Check your inbox.";
      resetMessage.style.color = "green";
    })
    .catch((err) => {
      resetMessage.textContent = err.message;
      resetMessage.style.color = "red";
    });
});

// 🔐 Handle login form submit
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  loginError.textContent = "";
  loginSuccess.style.display = "none";
  loginSpinner.classList.remove("hidden");

  const persistence = rememberMe.checked
    ? browserLocalPersistence
    : browserSessionPersistence;

  setPersistence(auth, persistence)
    .then(() => signInWithEmailAndPassword(auth, email, password))
    .then(() => {
      loginSpinner.classList.add("hidden");
      loginSuccess.style.display = "block";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    })
    .catch((err) => {
      loginSpinner.classList.add("hidden");
      loginError.textContent =
        "Invalid email or password. Please try again.";
      console.error("Login failed:", err);
    });
});

// 🔘 Google login
googleLoginBtn?.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(() => {
      loginSuccess.style.display = "block";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch((err) => {
      loginError.textContent = "Google login failed. Please try again.";
      console.error("Google login failed:", err);
    });
});

// 🔒 Maintain login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.email);
  }
});
