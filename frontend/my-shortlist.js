import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { auth, db } from "./firebase-config-utils.js";

const accountNotice = document.getElementById("accountNotice");
const universityList = document.getElementById("universityList");
const emptyState = document.getElementById("emptyState");
const createButton = document.getElementById("createShareLink");
const shareLinkRow = document.getElementById("shareLinkRow");
const shareUrl = document.getElementById("shareUrl");
const selectionCount = document.getElementById("selectionCount");
const toast = document.getElementById("toast");
let toastTimeout;
let universities = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2500);
}

function readLocalWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("eduNavia_univ_wishlist") || "[]");
    return Array.isArray(saved) ? saved.filter(name => typeof name === "string" && name.trim()) : [];
  } catch {
    return [];
  }
}

function renderUniversities() {
  universityList.replaceChildren();
  emptyState.hidden = universities.length > 0;
  universities.forEach(university => {
    const label = document.createElement("label");
    label.className = "university-choice";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = university.name;
    checkbox.addEventListener("change", updateSelection);
    const name = document.createElement("span");
    name.className = "university-name";
    name.textContent = university.name;
    const source = document.createElement("span");
    source.className = "university-source";
    source.textContent = university.source;
    label.append(checkbox, name, source);
    universityList.append(label);
  });
  updateSelection();
}

function updateSelection() {
  const count = universityList.querySelectorAll("input:checked").length;
  selectionCount.textContent = `${count} selected`;
  createButton.disabled = count === 0;
}

function updateAccountNotice(message, isError = false) {
  accountNotice.replaceChildren();
  accountNotice.classList.toggle("error", isError);
  accountNotice.append(document.createTextNode(message));
}

function showLoginLinks() {
  accountNotice.replaceChildren(document.createTextNode("Sign in to use your saved universities. "));
  accountNotice.classList.add("error");
  const login = document.createElement("a");
  login.href = "login.html";
  login.textContent = "Sign in";
  accountNotice.append(login, document.createTextNode(" or "));
  const signup = document.createElement("a");
  signup.href = "signup.html";
  signup.textContent = "create an account";
  accountNotice.append(signup);
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    universities = [];
    renderUniversities();
    showLoginLinks();
    return;
  }

  updateAccountNotice("Loading your saved universities...");
  try {
    const profileSnapshot = await getDoc(doc(db, "userProfiles", user.uid));
    const profileUniversities = profileSnapshot.exists() && Array.isArray(profileSnapshot.data().universityWishlist)
      ? profileSnapshot.data().universityWishlist
      : [];
    const sources = new Map();
    profileUniversities.filter(name => typeof name === "string" && name.trim()).forEach(name => sources.set(name, "Profile wishlist"));
    readLocalWishlist().forEach(name => sources.set(name, sources.has(name) ? "Saved university" : "This browser"));
    universities = [...sources.entries()].map(([name, source]) => ({ name, source }));
    renderUniversities();
    updateAccountNotice("Select only the universities you want to share.");
  } catch (error) {
    console.error("Could not load saved universities", error);
    universities = [];
    renderUniversities();
    updateAccountNotice("Could not load saved universities. Check your connection and try again.", true);
  }
});

createButton.addEventListener("click", () => {
  const selectedNames = [...universityList.querySelectorAll("input:checked")].map(input => input.value);
  if (!selectedNames.length) return;
  const payload = {
    version: 1,
    createdAt: new Date().toISOString(),
    applications: selectedNames.map(university => ({
      university,
      program: "",
      deadline: "",
      status: "Shortlisted"
    }))
  };
  const url = new URL("shortlist.html", window.location.href);
  url.hash = JSON.stringify(payload);
  shareUrl.value = url.href;
  shareLinkRow.hidden = false;
  shareUrl.focus();
  shareUrl.select();
});

document.getElementById("copyShareUrl").addEventListener("click", async () => {
  if (!shareUrl.value) return;
  try {
    await navigator.clipboard.writeText(shareUrl.value);
  } catch {
    shareUrl.focus();
    shareUrl.select();
    document.execCommand("copy");
  }
  showToast("Shortlist link copied.");
});