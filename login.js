

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔧 DOM elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMe = document.getElementById('rememberMe');
const loginError = document.getElementById('error');
const loginSuccess = document.getElementById('success');
const loginSpinner = document.getElementById('spinner');
const togglePasswordBtn = document.querySelector('.toggle-password');
const googleLoginBtn = document.querySelector('.google-btn');
const forgotLink = document.getElementById('forgot-password');

// 🌗 Toggle dark mode
window.toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

// 👁️ Toggle password visibility
window.togglePassword = () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
};

// ✉️ Forgot password flow
forgotLink?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email) {
    loginError.textContent = "Enter your email to reset password.";
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(() => alert("Password reset link sent to your email."))
    .catch(err => loginError.textContent = err.message);
});

// 🔐 Handle login form
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
        window.location.href = "index.html"; // Redirect on success
      }, 1200);
    })
    .catch(err => {
      loginSpinner.classList.add("hidden");
      loginError.textContent = "Invalid email or password. Please try again.";
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
    .catch(err => {
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


