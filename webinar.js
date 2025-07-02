const webinars = [
  {
    title: "Top Indian Institutes: IITs, NITs, and Beyond",
    date: "2025-06-20T18:00:00",  // Include time for better countdown accuracy
    description: "A detailed look at top engineering institutes in India and how to apply.",
    link: "register.html"
  },
  {
    title: "How to Crack JEE & NEET",
    date: "2025-07-05T17:00:00",
    description: "Get expert strategies for India's top entrance exams.",
    link: "register.html"
  },
  {
    title: "Career Opportunities after Studying in India",
    date: "2025-07-15T16:00:00",
    description: "Explore job markets and industries for graduates from Indian universities.",
    link: "register.html"
  },
  {
    title: "Mastering English for Indian Competitive Exams",
    date: "2025-07-25T19:00:00",
    description: "Tips for improving English skills for exams like UPSC, SSC, and bank exams.",
    link: "register.html"
  },
  {
    title: "All About CLAT & Law Schools in India",
    date: "2025-07-30T18:30:00",
    description: "Your complete guide to cracking CLAT and selecting the best law colleges.",
    link: "register.html"
  },
  {
    title: "Design Careers in India: NID, NIFT & More",
    date: "2025-08-05T17:30:00",
    description: "Learn about top design schools in India and how to build a portfolio.",
    link: "register.html"
  },
  {
    title: "Preparing for UPSC CSE: Strategies from Toppers",
    date: "2025-08-12T18:00:00",
    description: "A step-by-step preparation guide for the Civil Services Examination.",
    link: "register.html"
  },
  {
    title: "Commerce Pathways: CA, CS, CMA Explained",
    date: "2025-08-18T17:00:00",
    description: "Understand the roadmap and career scope for CA, CS, and CMA in India.",
    link: "register.html"
  },
  {
    title: "Scholarships & Financial Aid for Indian Students",
    date: "2025-08-25T16:30:00",
    description: "Find out about national and state-level scholarships for Indian students.",
    link: "register.html"
  },
  {
    title: "MBA in India: IIMs and Beyond",
    date: "2025-09-01T18:00:00",
    description: "Insights into CAT preparation and selecting the right B-school.",
    link: "register.html"
  },
  {
    title: "Opportunities in Indian Startups: For Fresh Graduates",
    date: "2025-09-10T17:30:00",
    description: "Discover how to join and grow in India's booming startup ecosystem.",
    link: "register.html"
  },
  {
    title: "State vs. Central Universities: Which is Right for You?",
    date: "2025-09-18T17:00:00",
    description: "A comparative session on choosing between state and central universities in India.",
    link: "register.html"
  }
];

function displayWebinars(list) {
  const webinarList = document.getElementById("webinarList");
  webinarList.innerHTML = "";
  list.forEach((w, index) => {
    const card = document.createElement("div");
    card.className = "webinar-card";
    card.innerHTML = `
      <div class="webinar-title">${w.title}</div>
      <div class="webinar-date">📅 ${w.date.split("T")[0]}</div>
      <div class="webinar-countdown" id="countdown-${index}">Loading countdown...</div>
      <div class="webinar-description">${w.description}</div>
      <a href="${w.link}">Register Now →</a>
    `;
    webinarList.appendChild(card);
    startCountdown(w.date, `countdown-${index}`);
  });
}

function startCountdown(dateStr, elementId) {
  const targetDate = new Date(dateStr).getTime();
  const el = document.getElementById(elementId);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      el.innerHTML = "🎉 Live Now!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    el.innerHTML = `Starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;

    setTimeout(update, 1000);
  }

  update();
}

window.onload = () => {
  displayWebinars(webinars);
};
