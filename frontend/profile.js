import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔧 Firebase Config
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

// 🔄 Firebase Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUID = null;

// 💬 Rotating Quotes
const quotes = [
  "Believe you can and you're halfway there.",
  "Push yourself, because no one else will.",
  "Your limitation—it’s only your imagination.",
  "Dream big. Work hard. Stay focused.",
  "Every accomplishment starts with trying."
];

function rotateQuotes() {
  const el = document.getElementById("quoteText");
  let index = 0;
  setInterval(() => {
    el.textContent = quotes[index];
    index = (index + 1) % quotes.length;
  }, 5000);
}

// 👤 On Auth State Change
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    Swal.fire("Please Login", "You are not logged in.", "warning").then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  currentUID = user.uid;

  // Default profile data
  const data = {
    name: user.displayName || "User",
    email: user.email,
    role: "Student",
    linkedin: "",
    github: "",
    phone: "",
    universityWishlist: [],
    courseWishlist: []
  };

  // Fetch user profile
  const userRef = doc(db, "userProfiles", currentUID);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    showUserData(snap.data());
  } else {
    // Create default profile if missing
    await setDoc(userRef, data);
    showUserData(data);
  }

  loadSelectOptions();
  rotateQuotes();
});

// 👁️ Show Profile Data
function showUserData(data) {
  const username = data.name || "User";
  document.getElementById("username").textContent = username;
  document.getElementById("userrole").textContent = data.role;

  document.getElementById("nameInput").value = username;
  document.getElementById("emailInput").value = data.email || "";
  document.getElementById("roleInput").value = data.role || "";
  document.getElementById("linkedinInput").value = data.linkedin || "";
  document.getElementById("githubInput").value = data.github || "";
  document.getElementById("phoneInput").value = data.phone || "";

  const initial = username.trim().charAt(0).toUpperCase() || "U";
  const avatar = document.getElementById("initialAvatar");
  if (avatar) {
    avatar.textContent = initial;
    avatar.style.backgroundColor = generateColorFromString(username);
  }

  renderSocialLinks(data);
  updateProgress(data);
  renderWishlist("universityWishlist", data.universityWishlist);
  renderWishlist("courseWishlist", data.courseWishlist);
}

function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

// 🔗 Render Social Links
function renderSocialLinks(data) {
  const links = document.getElementById("socialLinks");
  links.innerHTML = "";
  if (data.linkedin) links.innerHTML += `<a href="${data.linkedin}" target="_blank">🔗 LinkedIn</a>`;
  if (data.github) links.innerHTML += `<a href="${data.github}" target="_blank">💻 GitHub</a>`;
}

// 📊 Profile Completion Progress
function updateProgress(data) {
  const fields = [data.name, data.role, data.linkedin, data.github, data.phone];
  const filled = fields.filter(f => f && f.trim()).length;
  const percent = Math.round((filled / fields.length) * 100);
  document.getElementById("progressFill").style.width = `${percent}%`;
  document.getElementById("progressText").textContent = `${percent}%`;
  document.getElementById("progressFill").style.backgroundColor = percent === 100 ? "#4CAF50" : "teal";
}

// 📋 Render Wishlist Items
function renderWishlist(id, list = []) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  if (!list || list.length === 0) {
    el.innerHTML = "<li style='color:#777;'>No items yet</li>";
    return;
  }
  list.forEach(item => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "remove-btn";
    btn.textContent = "❌";
    btn.dataset.type = id;
    btn.dataset.value = item;
    btn.addEventListener("click", handleRemove);
    li.textContent = item;
    li.appendChild(btn);
    el.appendChild(li);
  });
}

// ❌ Remove Wishlist Item
async function handleRemove(e) {
  const field = e.target.dataset.type;
  const value = e.target.dataset.value;
  try {
    await setDoc(doc(db, "userProfiles", currentUID), {
      [field]: arrayRemove(value)
    }, { merge: true });

    const snap = await getDoc(doc(db, "userProfiles", currentUID));
    showUserData(snap.data());
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Could not remove item", "error");
  }
}

// 📚 Load Dropdowns
async function loadSelectOptions() {
  const uniSnap = await getDocs(collection(db, "colleges"));
  const courseSnap = await getDocs(collection(db, "courses"));

  const uniSelect = document.getElementById("universitySelect");
  const courseSelect = document.getElementById("courseSelect");

  uniSnap.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.data().name;
    opt.textContent = doc.data().name;
    uniSelect.appendChild(opt);
  });

  courseSnap.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.data().name;
    opt.textContent = doc.data().name;
    courseSelect.appendChild(opt);
  });
}

// ➕ Add University
document.getElementById("addUniversityBtn").addEventListener("click", async () => {
  const selected = document.getElementById("universitySelect").value;
  if (!selected) return Swal.fire("Select one", "Choose a university", "info");

  await setDoc(doc(db, "userProfiles", currentUID), {
    universityWishlist: arrayUnion(selected)
  }, { merge: true });

  const snap = await getDoc(doc(db, "userProfiles", currentUID));
  showUserData(snap.data());
});

// ➕ Add Course
document.getElementById("addCourseBtn").addEventListener("click", async () => {
  const selected = document.getElementById("courseSelect").value;
  if (!selected) return Swal.fire("Select one", "Choose a course", "info");

  await setDoc(doc(db, "userProfiles", currentUID), {
    courseWishlist: arrayUnion(selected)
  }, { merge: true });

  const snap = await getDoc(doc(db, "userProfiles", currentUID));
  showUserData(snap.data());
});

// ✏️ Toggle Edit
document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("editSection").classList.toggle("hidden");
});

// 💾 Save Profile
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("nameInput").value.trim();
  const role = document.getElementById("roleInput").value;
  const linkedin = document.getElementById("linkedinInput").value.trim();
  const github = document.getElementById("githubInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();

  if (!name) return Swal.fire("Missing Info", "Name is required", "warning");

  try {
    await setDoc(doc(db, "userProfiles", currentUID), {
      name, role, linkedin, github, phone
    }, { merge: true });

    Swal.fire("Saved", "Profile updated!", "success");

    const snap = await getDoc(doc(db, "userProfiles", currentUID));
    showUserData(snap.data());

    document.getElementById("editSection").classList.add("hidden");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Could not update profile", "error");
  }
});

// 🗑 Delete Account
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return Swal.fire("Error", "No user logged in", "error");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action is irreversible! Your account and all data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user);
        Swal.fire("Deleted!", "Your account has been deleted.", "success").then(() => {
          window.location.href = "index.html";
        });
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          Swal.fire(
            "Authentication Required",
            "Please log in again before deleting your account.",
            "warning"
          );
        } else {
          Swal.fire("Error", "Failed to delete account: " + error.message, "error");
        }
      }
    }
  });
}
