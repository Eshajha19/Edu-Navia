const content = document.getElementById("shortlistContent");
const emptyState = document.getElementById("emptyState");
const validStatuses = new Set(["Considering", "In progress", "Submitted", "Accepted", "Waitlisted", "Not selected", "Shortlisted"]);

function addText(parent, tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "No deadline";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(year, month - 1, day, 12));
}

function loadShortlist() {
  try {
    const payload = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
    if (payload.version !== 1 || !Array.isArray(payload.applications) || payload.applications.length === 0 || payload.applications.length > 30) throw new Error("Invalid shortlist");
    const applications = payload.applications.filter(application =>
      application && typeof application.university === "string" && application.university.length <= 120
    );
    if (!applications.length) throw new Error("No shortlist entries");

    applications.forEach((application, index) => {
      const card = document.createElement("article");
      card.className = "shortlist-card";
      addText(card, "span", "card-number", String(index + 1).padStart(2, "0"));
      const description = document.createElement("div");
      addText(description, "h2", "card-name", application.university);
      if (typeof application.program === "string" && application.program) addText(description, "p", "card-program", application.program.slice(0, 120));
      card.append(description);
      const meta = document.createElement("div");
      meta.className = "card-meta";
      addText(meta, "span", "meta-pill", formatDate(application.deadline));
      if (validStatuses.has(application.status)) addText(meta, "span", "meta-pill status", application.status);
      card.append(meta);
      content.append(card);
    });
  } catch {
    emptyState.hidden = false;
  }
}

loadShortlist();