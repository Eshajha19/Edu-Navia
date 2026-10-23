import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { auth, db } from "./firebase-config-utils.js";

const accountNotice = document.getElementById("accountNotice");
const applicationList = document.getElementById("applicationsList");
const emptyState = document.getElementById("emptyState");
const applicationDialog = document.getElementById("applicationDialog");
const applicationForm = document.getElementById("applicationForm");
const wishlistSelect = document.getElementById("wishlistSelect");
const addWishlistButton = document.getElementById("addWishlistUniversity");
const statusFilter = document.getElementById("statusFilter");
const toast = document.getElementById("toast");
const statuses = ["Considering", "In progress", "Submitted", "Accepted", "Waitlisted", "Not selected"];
let currentUser = null;
let applications = [];
let saveQueue = Promise.resolve();
let toastTimer;

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setAccountMessage(message, isError = false) {
  accountNotice.replaceChildren();
  accountNotice.classList.toggle("error", isError);
  accountNotice.append(document.createTextNode(message));
}

function setLoginMessage() {
  accountNotice.replaceChildren(document.createTextNode("Sign in to save your application plan across devices. "));
  accountNotice.classList.add("error");
  const login = createElement("a", "", "Sign in");
  login.href = "login.html";
  const signup = createElement("a", "", "create an account");
  signup.href = "signup.html";
  accountNotice.append(login, document.createTextNode(" or "), signup);
}

function appIsSubmitted(application) {
  return ["Submitted", "Accepted", "Waitlisted", "Not selected"].includes(application.status);
}

function safeApplicationUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function getBrowserWishlist() {
  try {
    const wishlist = JSON.parse(localStorage.getItem("eduNavia_univ_wishlist") || "[]");
    return Array.isArray(wishlist) ? wishlist.filter(name => typeof name === "string" && name.trim()) : [];
  } catch {
    return [];
  }
}

function dateAtLocalNoon(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function formatDate(dateString) {
  if (!dateString) return "No deadline set";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(dateAtLocalNoon(dateString));
}

function escapeCalendarText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function foldCalendarLine(line) {
  const folded = [];
  let current = "";
  let byteLength = 0;
  for (const character of line) {
    const characterLength = new TextEncoder().encode(character).length;
    if (byteLength + characterLength > 75) {
      folded.push(current);
      current = ` ${character}`;
      byteLength = characterLength + 1;
    } else {
      current += character;
      byteLength += characterLength;
    }
  }
  folded.push(current);
  return folded.join("\r\n");
}

function addCalendarDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function downloadCalendarReminder(application) {
  if (!application.deadline) return;
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const startDate = application.deadline.replace(/-/g, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Edu Navia//Application Planner//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${application.id}@edunavia`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${addCalendarDays(application.deadline, 1)}`,
    `SUMMARY:${escapeCalendarText(`Application deadline: ${application.university}`)}`,
    `DESCRIPTION:${escapeCalendarText([application.program, application.url].filter(Boolean).join("\n"))}`
  ];
  if (application.reminderDays !== "none") {
    lines.push(
      "BEGIN:VALARM",
      `TRIGGER:-P${application.reminderDays || "1"}D`,
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeCalendarText(`Application deadline: ${application.university}`)}`,
      "END:VALARM"
    );
  }
  lines.push("END:VEVENT", "END:VCALENDAR");

  const calendar = lines.map(foldCalendarLine).join("\r\n");
  const file = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${application.university.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "application"}-deadline.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function deadlineClass(application) {
  if (!application.deadline || appIsSubmitted(application)) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = dateAtLocalNoon(application.deadline);
  deadline.setHours(0, 0, 0, 0);
  const days = Math.round((deadline - today) / 86400000);
  if (days < 0) return "deadline-overdue";
  if (days <= 14) return "deadline-soon";
  return "";
}

function updateSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = applications.filter(application => {
    if (!application.deadline || appIsSubmitted(application)) return false;
    const deadline = dateAtLocalNoon(application.deadline);
    deadline.setHours(0, 0, 0, 0);
    const days = (deadline - today) / 86400000;
    return days >= 0 && days <= 14;
  }).length;
  const submitted = applications.filter(appIsSubmitted).length;
  const fees = applications.reduce((total, application) => total + (Number(application.fee) || 0), 0);
  document.getElementById("totalCount").textContent = String(applications.length);
  document.getElementById("upcomingCount").textContent = String(upcoming);
  document.getElementById("submittedCount").textContent = String(submitted);
  document.getElementById("feeTotal").textContent = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(fees);
}

function buildApplicationCard(application) {
  const card = createElement("article", "application-card");
  const topLine = createElement("div", "card-topline");
  const titleBlock = createElement("div");
  titleBlock.append(createElement("h3", "application-name", application.university));
  if (application.program) titleBlock.append(createElement("p", "application-program", application.program));

  const actions = createElement("div", "card-actions");
  const status = createElement("select", "status-select");
  status.setAttribute("aria-label", `Status for ${application.university}`);
  statuses.forEach(value => {
    const option = createElement("option", "", value);
    option.value = value;
    option.selected = value === application.status;
    status.append(option);
  });
  status.addEventListener("change", () => updateApplication(application.id, { status: status.value }));
  actions.append(status);

  const remove = createElement("button", "delete-button", "×");
  remove.type = "button";
  remove.setAttribute("aria-label", `Remove ${application.university} from your plan`);
  remove.addEventListener("click", () => {
    if (!window.confirm(`Remove the ${application.university} application and its tasks from your plan?`)) return;
    applications = applications.filter(item => item.id !== application.id);
    renderApplications();
    persistApplications();
  });
  actions.append(remove);
  topLine.append(titleBlock, actions);
  card.append(topLine);

  const meta = createElement("div", "application-meta");
  const deadline = createElement("span", `meta-item ${deadlineClass(application)}`);
  deadline.append(createElement("strong", "", "Deadline"), document.createTextNode(` ${formatDate(application.deadline)}`));
  meta.append(deadline);
  if (application.deadline) {
    const reminderLabel = createElement("label", "reminder-control", "Reminder");
    const reminderSelect = createElement("select", "reminder-select");
    reminderSelect.setAttribute("aria-label", `Reminder for ${application.university}`);
    [
      ["none", "None"],
      ["1", "1 day before"],
      ["3", "3 days before"],
      ["7", "1 week before"]
    ].forEach(([value, label]) => {
      const option = createElement("option", "", label);
      option.value = value;
      option.selected = (application.reminderDays || "1") === value;
      reminderSelect.append(option);
    });
    reminderSelect.addEventListener("change", () => updateApplication(application.id, { reminderDays: reminderSelect.value }));
    reminderLabel.append(reminderSelect);
    meta.append(reminderLabel);

    const calendarButton = createElement("button", "calendar-button", "Add to calendar");
    calendarButton.type = "button";
    calendarButton.addEventListener("click", () => downloadCalendarReminder(application));
    meta.append(calendarButton);
  }
  if (application.fee !== "" && application.fee !== null && application.fee !== undefined) {
    const fee = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(application.fee) || 0);
    const feeItem = createElement("span", "meta-item");
    feeItem.append(createElement("strong", "", "Fee"), document.createTextNode(` ${fee}`));
    meta.append(feeItem);
  }
  if (application.url) {
    const link = createElement("a", "official-link", "Official application site");
    const safeUrl = safeApplicationUrl(application.url);
    if (safeUrl) {
      link.href = safeUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      meta.append(link);
    }
  }
  card.append(meta);

  const taskHeader = createElement("div", "tasks-header");
  taskHeader.append(createElement("h3", "", "Application tasks"));
  const tasks = application.tasks || [];
  taskHeader.append(createElement("span", "task-count", `${tasks.filter(task => task.done).length} of ${tasks.length} complete`));
  card.append(taskHeader);
  const taskList = createElement("ul", "task-list");
  tasks.forEach(task => {
    const row = createElement("li", `task-row${task.done ? " done" : ""}`);
    const checkbox = createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(task.done);
    checkbox.setAttribute("aria-label", `${task.done ? "Mark incomplete" : "Complete"}: ${task.text}`);
    checkbox.addEventListener("change", () => {
      updateApplication(application.id, { tasks: tasks.map(item => item.id === task.id ? { ...item, done: checkbox.checked } : item) });
    });
    row.append(checkbox, createElement("span", "", task.text));
    const removeTask = createElement("button", "remove-task", "×");
    removeTask.type = "button";
    removeTask.setAttribute("aria-label", `Remove task: ${task.text}`);
    removeTask.addEventListener("click", () => updateApplication(application.id, { tasks: tasks.filter(item => item.id !== task.id) }));
    row.append(removeTask);
    taskList.append(row);
  });
  card.append(taskList);

  const taskForm = createElement("form", "add-task-form");
  const taskInput = createElement("input");
  taskInput.type = "text";
  taskInput.maxLength = 160;
  taskInput.placeholder = "Add a task";
  taskInput.setAttribute("aria-label", `New task for ${application.university}`);
  const addTask = createElement("button", "", "+");
  addTask.type = "submit";
  addTask.setAttribute("aria-label", `Add task for ${application.university}`);
  taskForm.append(taskInput, addTask);
  taskForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (text) updateApplication(application.id, { tasks: [...tasks, { id: crypto.randomUUID(), text, done: false }] });
  });
  card.append(taskForm);
  return card;
}

function renderApplications() {
  updateSummary();
  applicationList.replaceChildren();
  const visible = applications
    .filter(application => statusFilter.value === "all" || application.status === statusFilter.value)
    .slice()
    .sort((a, b) => (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31"));
  visible.forEach(application => applicationList.append(buildApplicationCard(application)));
  emptyState.hidden = applications.length > 0;
  if (applications.length > 0 && visible.length === 0) applicationList.append(createElement("p", "data-note", "No applications match this status."));
}

function persistApplications() {
  if (!currentUser) return Promise.resolve();
  const snapshot = applications.map(application => ({ ...application, tasks: (application.tasks || []).map(task => ({ ...task })) }));
  const profileRef = doc(db, "userProfiles", currentUser.uid);
  saveQueue = saveQueue.catch(() => {}).then(() => setDoc(profileRef, {
    applicationPlans: snapshot,
    applicationPlansUpdatedAt: serverTimestamp()
  }, { merge: true })).then(() => {
    setAccountMessage("All changes saved to your account.");
  }).catch(error => {
    console.error("Could not save application plan", error);
    setAccountMessage("Your changes could not be saved. Check your connection and try again.", true);
    showToast("Could not save changes. Please try again.");
  });
  return saveQueue;
}

function updateApplication(id, changes) {
  applications = applications.map(application => application.id === id ? { ...application, ...changes } : application);
  renderApplications();
  persistApplications();
}

function makeApplication(university, details = {}) {
  return { id: crypto.randomUUID(), university, program: details.program || "", deadline: details.deadline || "", fee: details.fee ?? "", url: details.url || "", reminderDays: details.reminderDays || "1", status: "Considering", tasks: details.tasks || [] };
}

function addWishlistUniversity() {
  const university = wishlistSelect.value;
  if (!university) return;
  if (applications.some(application => application.university.toLowerCase() === university.toLowerCase())) return showToast("That university is already in your plan.");
  const tasks = ["Review eligibility and requirements", "Gather required documents", "Complete and submit the application"]
    .map(text => ({ id: crypto.randomUUID(), text, done: false }));
  applications.push(makeApplication(university, { tasks }));
  renderApplications();
  persistApplications();
  showToast(`${university} added to your plan.`);
}

function populateWishlist(universities) {
  wishlistSelect.replaceChildren();
  const placeholder = createElement("option", "", universities.length ? "Choose a saved university" : "No saved universities yet");
  placeholder.value = "";
  wishlistSelect.append(placeholder);
  universities.forEach(university => {
    const option = createElement("option", "", university);
    option.value = university;
    wishlistSelect.append(option);
  });
  wishlistSelect.disabled = universities.length === 0;
  addWishlistButton.disabled = universities.length === 0;
}

function openDialog(university = "") {
  if (!currentUser) {
    setLoginMessage();
    showToast("Sign in to save an application plan.");
    return;
  }
  applicationForm.reset();
  document.getElementById("initialTasks").value = "Review eligibility and requirements\nGather required documents\nComplete and submit the application";
  document.getElementById("universityName").value = university;
  applicationDialog.showModal();
  document.getElementById("universityName").focus();
}

document.getElementById("openApplicationDialog").addEventListener("click", () => openDialog());
document.getElementById("emptyAddButton").addEventListener("click", () => openDialog());
document.getElementById("closeApplicationDialog").addEventListener("click", () => applicationDialog.close());
document.getElementById("cancelApplication").addEventListener("click", () => applicationDialog.close());
addWishlistButton.addEventListener("click", addWishlistUniversity);
statusFilter.addEventListener("change", renderApplications);

applicationForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!currentUser) return;
  const university = document.getElementById("universityName").value.trim();
  if (!university) return;
  if (applications.some(application => application.university.toLowerCase() === university.toLowerCase())) return showToast("That university is already in your plan.");
  const tasks = document.getElementById("initialTasks").value.split("\n").map(text => text.trim()).filter(Boolean)
    .map(text => ({ id: crypto.randomUUID(), text: text.slice(0, 160), done: false }));
  applications.push(makeApplication(university, {
    program: document.getElementById("programName").value.trim(),
    deadline: document.getElementById("applicationDeadline").value,
    fee: document.getElementById("applicationFee").value,
    url: safeApplicationUrl(document.getElementById("applicationUrl").value.trim()),
    tasks
  }));
  applicationDialog.close();
  renderApplications();
  persistApplications();
  showToast(`${university} added to your plan.`);
});

document.getElementById("wishlistLink").addEventListener("click", event => {
  if (currentUser && wishlistSelect.options.length > 1) {
    event.preventDefault();
    wishlistSelect.focus();
  }
});

onAuthStateChanged(auth, async user => {
  currentUser = user;
  if (!user) {
    applications = [];
    populateWishlist([]);
    renderApplications();
    setLoginMessage();
    return;
  }
  setAccountMessage("Loading your application plan...");
  try {
    const snapshot = await getDoc(doc(db, "userProfiles", user.uid));
    const profile = snapshot.exists() ? snapshot.data() : {};
    applications = Array.isArray(profile.applicationPlans) ? profile.applicationPlans.map(application => ({
      id: application.id || crypto.randomUUID(),
      university: String(application.university || "Untitled university"),
      program: String(application.program || ""),
      deadline: String(application.deadline || ""),
      fee: application.fee ?? "",
      url: safeApplicationUrl(String(application.url || "")),
      reminderDays: ["none", "1", "3", "7"].includes(String(application.reminderDays)) ? String(application.reminderDays) : "1",
      status: statuses.includes(application.status) ? application.status : "Considering",
      tasks: Array.isArray(application.tasks) ? application.tasks.map(task => ({
        id: task.id || crypto.randomUUID(), text: String(task.text || ""), done: Boolean(task.done)
      })).filter(task => task.text) : []
    })) : [];
    const profileWishlist = Array.isArray(profile.universityWishlist) ? profile.universityWishlist.filter(name => typeof name === "string" && name.trim()) : [];
    const wishlist = [...new Set([...profileWishlist, ...getBrowserWishlist()])];
    populateWishlist(wishlist);
    renderApplications();
    setAccountMessage("All changes are saved to your account.");
  } catch (error) {
    console.error("Could not load application plan", error);
    setAccountMessage("We couldn't load your plan. Check your connection and refresh the page.", true);
  }
});