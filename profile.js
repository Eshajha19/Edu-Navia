

// 🔄 Firebase Init 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUID = null;
let userDocId = null; // ID will be user's name

// 💬 Rotating QuotesDocument 
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

  let data = {
    name: user.displayName || "user_" + currentUID,
    email: user.email,
    role: "Student",
    linkedin: "",
    github: "",
    phone: "",
    universityWishlist: [],
    courseWishlist: []
  };

  // 🧠 Use user's name as Firestore document ID (cleaned)
  const cleanedName = data.name.toLowerCase().replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
  userDocId = cleanedName;

  const userRef = doc(db, "users", userDocId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    data = { ...data, ...snap.data() };
  }

  showUserData(data);
  loadSelectOptions();
  rotateQuotes();
});

// 👁️ Show Profile Data
function showUserData(data) {
  const username = data.name || "User";
  document.getElementById("username").textContent = username;
  document.getElementById("userrole").textContent = data.role;

  document.getElementById("nameInput").value = username;
  document.getElementById("emailInput").value = data.email;
  document.getElementById("roleInput").value = data.role;
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

  if (data.linkedin) {
    links.innerHTML += `<a href="${data.linkedin}" target="_blank">🔗 LinkedIn</a>`;
  }

  if (data.github) {
    links.innerHTML += `<a href="${data.github}" target="_blank">💻 GitHub</a>`;
  }
}

// 📊 Profile Completion Progress
function updateProgress(data) {
  const fields = [data.name, data.role, data.linkedin, data.github, data.phone];
  const filled = fields.filter(f => f && f.trim()).length;
  const percent = Math.round((filled / fields.length) * 100);
  document.getElementById("progressFill").style.width = `${percent}%`;
  document.getElementById("progressText").textContent = `${percent}%`;
  document.getElementById("progressFill").style.backgroundColor =
    percent === 100 ? "#4CAF50" : "teal";
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
    await updateDoc(doc(db, "users", userDocId), {
      [field]: arrayRemove(value)
    });

    const snap = await getDoc(doc(db, "users", userDocId));
    showUserData(snap.data());
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Could not remove item", "error");
  }
}

// 📚 Load Dropdowns for Courses & Universities
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

// ➕ Add University to Wishlist
document.getElementById("addUniversityBtn").addEventListener("click", async () => {
  const selected = document.getElementById("universitySelect").value;
  if (!selected) return Swal.fire("Select one", "Choose a university", "info");

  const ref = doc(db, "users", userDocId);
  await updateDoc(ref, {
    universityWishlist: arrayUnion(selected)
  });

  const snap = await getDoc(ref);
  showUserData(snap.data());
});

// ➕ Add Course to Wishlist
document.getElementById("addCourseBtn").addEventListener("click", async () => {
  const selected = document.getElementById("courseSelect").value;
  if (!selected) return Swal.fire("Select one", "Choose a course", "info");

  const ref = doc(db, "users", userDocId);
  await updateDoc(ref, {
    courseWishlist: arrayUnion(selected)
  });

  const snap = await getDoc(ref);
  showUserData(snap.data());
});

// ✏️ Toggle Edit Mode
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
  const email = document.getElementById("emailInput").value.trim();

  if (!name) return Swal.fire("Missing Info", "Name is required", "warning");

  try {
    await setDoc(doc(db, "users", userDocId), {
      name,
      role,
      linkedin,
      github,
      phone
    }, { merge: true });

    Swal.fire("Saved", "Profile updated!", "success");

    showUserData({ name, role, linkedin, github, phone, email });
    document.getElementById("editSection").classList.add("hidden");

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Could not update profile", "error");
  }
});


