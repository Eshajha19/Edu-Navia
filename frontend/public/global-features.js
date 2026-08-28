document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. ADD FLOTING BUTTONS TO THE DOM
  // ==========================================

  // Create Dark/Light Mode Toggle Button
  const themeToggle = document.createElement("button");
  themeToggle.id = "globalThemeToggle";
  themeToggle.className = "global-theme-toggle";
  themeToggle.setAttribute("aria-label", "Toggle Dark/Light Mode");
  document.body.appendChild(themeToggle);

  // Create Scroll-to-Top Button
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "globalScrollTop";
  scrollTopBtn.className = "global-scroll-top";
  scrollTopBtn.innerHTML = "⬆️";
  scrollTopBtn.setAttribute("aria-label", "Scroll to Top");
  document.body.appendChild(scrollTopBtn);

  // ==========================================
  // 2. THEME TOGGLE LOGIC
  // ==========================================
  const htmlEl = document.documentElement;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("edu-navia-theme");

  if (savedTheme === "dark") {
    htmlEl.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    htmlEl.setAttribute("data-theme", "light");
    themeToggle.textContent = "🌙";
  }

  // Toggle event listener
  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlEl.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlEl.setAttribute("data-theme", newTheme);

    // Update button icon
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";

    // Persist preference
    localStorage.setItem("edu-navia-theme", newTheme);
  });

  // ==========================================
  // 3. SCROLL-TO-TOP LOGIC
  // ==========================================

  // Show/hide button on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  // Smooth scroll to top on click
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
