const articles = [
  {
    title: "How should I build a university shortlist?",
    topic: "Course & university choices",
    category: "choices",
    body: "Start with the course you want, then compare each university's official entry requirements, total costs, location, and learning options. Keep a mix of ambitious, likely, and safer choices; an estimate is not an admission guarantee.",
    links: [{ label: "Find universities", href: "p.html" }, { label: "Compare universities", href: "compare.html" }],
    keywords: "shortlist university college choices course budget safe ambitious likely"
  },
  {
    title: "What should I compare beyond rankings?",
    topic: "Course & university choices",
    category: "choices",
    body: "Compare the specific program, entry requirements, tuition and other costs, location, support services, and outcomes that matter to you. Check that details refer to the same course and year, and confirm them on the university's official site.",
    links: [{ label: "Compare universities", href: "compare.html" }, { label: "Explore the map", href: "map.html" }],
    keywords: "rankings compare fees costs program outcomes location course"
  },
  {
    title: "How do entrance-exam cutoffs work?",
    topic: "Admissions",
    category: "admissions",
    body: "A cutoff is a past admission threshold for a specific exam, program, institution, category, and round. Cutoffs can move each year, so use historical values as context rather than a promise of admission.",
    links: [{ label: "Try the cutoff predictor", href: "predictor.html" }, { label: "Browse exam information", href: "examsinfo.html" }],
    keywords: "cutoff rank score exam previous year admission chance predictor"
  },
  {
    title: "Where can I verify current eligibility?",
    topic: "Admissions",
    category: "admissions",
    body: "Use the current admission notice from the university or exam authority. Check the course, academic year, subjects, marks, category rules, and any later corrections. If a third-party listing differs, follow the official notice and contact the institution for clarification.",
    links: [{ label: "Entrance exam information", href: "examsinfo.html" }, { label: "Find universities", href: "p.html" }],
    keywords: "eligibility qualifications subjects marks requirements official notice"
  },
  {
    title: "Which documents should I prepare?",
    topic: "Application planning",
    category: "planning",
    body: "Requirements differ by institution and applicant. Common requests may include academic records, identity details, photographs, and certificates relevant to your application. Use each institution's checklist, confirm file formats and deadlines, and only submit documents through its official channel.",
    links: [{ label: "Open your application planner", href: "application-planner.html" }],
    keywords: "documents certificates marksheet transcript identity application checklist upload"
  },
  {
    title: "How do I keep application deadlines organized?",
    topic: "Application planning",
    category: "planning",
    body: "Record the date from the official notice, the program it applies to, and the source link. Add preparation tasks with time to spare. Dates can change, so revisit the official page before submitting; calendar reminders work after importing the planner's calendar file.",
    links: [{ label: "Open your application planner", href: "application-planner.html" }, { label: "Track entrance exams", href: "exam_tracker.html" }],
    keywords: "deadline reminder dates calendar application planner timeline"
  },
  {
    title: "How do I find scholarships I may qualify for?",
    topic: "Funding",
    category: "funding",
    body: "Start with official government and institution portals. Read the latest scheme notice for eligible courses, income or academic criteria, required documents, award details, and the application window. Do not rely on an old listing for current dates or eligibility.",
    links: [{ label: "Explore official scholarship portals", href: "scholarships.html" }],
    keywords: "scholarship financial aid funding eligibility grant income government"
  },
  {
    title: "How can I estimate the full cost of studying?",
    topic: "Funding",
    category: "funding",
    body: "Look beyond tuition: include application and exam fees, housing, food, transport, books, and other required costs. Compare the same course duration and year, then ask the institution about aid and payment schedules. Treat estimates as a starting point and confirm fees directly.",
    links: [{ label: "Compare universities", href: "compare.html" }, { label: "Find scholarship portals", href: "scholarships.html" }],
    keywords: "cost budget affordability tuition accommodation living expenses aid fees"
  }
];

const searchInput = document.getElementById("articleSearch");
const topicFilter = document.getElementById("topicFilter");
const articleGrid = document.getElementById("articleGrid");
const articleCount = document.getElementById("articleCount");
const emptyState = document.getElementById("emptyState");

function addTextElement(parent, tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function buildArticle(article, index) {
  const details = document.createElement("details");
  details.className = "article";
  details.dataset.category = article.category;
  details.dataset.searchText = `${article.title} ${article.topic} ${article.body} ${article.keywords}`.toLowerCase();

  const summary = document.createElement("summary");
  addTextElement(summary, "span", "article-index", String(index + 1).padStart(2, "0"));
  const titleBlock = document.createElement("span");
  addTextElement(titleBlock, "span", "article-title", article.title);
  addTextElement(titleBlock, "span", "article-topic", article.topic);
  summary.append(titleBlock);
  details.append(summary);

  const body = document.createElement("div");
  body.className = "article-body";
  addTextElement(body, "p", "", article.body);
  if (article.links.length) {
    const links = document.createElement("div");
    links.className = "article-links";
    article.links.forEach(item => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = `${item.label} →`;
      links.append(link);
    });
    body.append(links);
  }
  details.append(body);
  return details;
}

articles.forEach((article, index) => articleGrid.append(buildArticle(article, index)));

function filterArticles() {
  const query = searchInput.value.trim().toLowerCase();
  const category = topicFilter.value;
  let visible = 0;

  articleGrid.querySelectorAll(".article").forEach(article => {
    const matchesQuery = !query || article.dataset.searchText.includes(query);
    const matchesCategory = category === "all" || article.dataset.category === category;
    const show = matchesQuery && matchesCategory;
    article.hidden = !show;
    if (show) visible++;
  });

  articleCount.textContent = `${visible} ${visible === 1 ? "article" : "articles"}`;
  emptyState.hidden = visible > 0;
}

searchInput.addEventListener("input", filterArticles);
topicFilter.addEventListener("change", filterArticles);
document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  topicFilter.value = "all";
  filterArticles();
  searchInput.focus();
});
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

filterArticles();