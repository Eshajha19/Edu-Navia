const portals = [
  {
    name: "National Scholarship Portal",
    tag: "Central and state schemes",
    description: "Check scholarship notices published through India's National Scholarship Portal. Scheme-specific rules and application windows vary.",
    levels: ["school", "diploma", "undergraduate", "postgraduate"],
    areas: ["general", "technical"],
    audience: "School, diploma, undergraduate, and postgraduate students",
    url: "https://scholarships.gov.in/"
  },
  {
    name: "AICTE Student Development Schemes",
    tag: "Technical education",
    description: "Explore student support schemes published by the All India Council for Technical Education.",
    levels: ["diploma", "undergraduate"],
    areas: ["technical"],
    audience: "Students in eligible technical programs",
    url: "https://www.aicte-india.org/schemes/students-development-schemes"
  },
  {
    name: "myScheme",
    tag: "Government scheme search",
    description: "Search government schemes by your profile and check the official eligibility details before applying.",
    levels: ["school", "diploma", "undergraduate", "postgraduate"],
    areas: ["general", "technical"],
    audience: "Students exploring central and state support",
    url: "https://www.myscheme.gov.in/"
  }
];

const levelFilter = document.getElementById("levelFilter");
const areaFilter = document.getElementById("areaFilter");
const portalGrid = document.getElementById("portalGrid");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

function renderPortals() {
  const level = levelFilter.value;
  const area = areaFilter.value;
  const matches = portals.filter(portal => {
    const matchesLevel = level === "all" || portal.levels.includes(level);
    const matchesArea = area === "all" || portal.areas.includes(area);
    return matchesLevel && matchesArea;
  });

  portalGrid.replaceChildren();
  matches.forEach(portal => {
    const card = document.createElement("article");
    card.className = "portal-card";

    const tag = document.createElement("span");
    tag.className = "portal-tag";
    tag.textContent = portal.tag;
    card.append(tag);

    const title = document.createElement("h3");
    title.textContent = portal.name;
    card.append(title);

    const description = document.createElement("p");
    description.textContent = portal.description;
    card.append(description);

    const audience = document.createElement("span");
    audience.className = "portal-audience";
    audience.textContent = portal.audience;
    card.append(audience);

    const link = document.createElement("a");
    link.className = "portal-link";
    link.href = portal.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Visit official portal ↗";
    card.append(link);

    portalGrid.append(card);
  });

  resultCount.textContent = `${matches.length} ${matches.length === 1 ? "source" : "sources"}`;
  noResults.hidden = matches.length > 0;
}

levelFilter.addEventListener("change", renderPortals);
areaFilter.addEventListener("change", renderPortals);
document.getElementById("resetFilters").addEventListener("click", () => {
  levelFilter.value = "all";
  areaFilter.value = "all";
  renderPortals();
});

renderPortals();