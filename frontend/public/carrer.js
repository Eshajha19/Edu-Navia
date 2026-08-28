
const careerPaths = {
  "Computer Science": [
    { level: "Entry", roles: ["Web Developer", "Software Engineer", "QA Tester"] },
    { level: "Mid", roles: ["Backend Developer", "AI/ML Engineer", "DevOps Engineer"] },
    { level: "Senior", roles: ["Tech Lead", "CTO", "AI Researcher"] }
  ],
  "Business & Management": [
    { level: "Entry", roles: ["Sales Executive", "Business Analyst Intern", "HR Assistant"] },
    { level: "Mid", roles: ["Operations Manager", "Product Manager", "Finance Manager"] },
    { level: "Senior", roles: ["COO", "Strategy Head", "VP Marketing"] }
  ],
  "Commerce": [
    { level: "Entry", roles: ["Account Assistant", "Junior Analyst", "Trainee Accountant"] },
    { level: "Mid", roles: ["Finance Analyst", "Cost Accountant", "Tax Consultant"] },
    { level: "Senior", roles: ["Financial Controller", "CFO", "Chartered Accountant"] }
  ],
  "Engineering": [
    { level: "Entry", roles: ["Junior Engineer", "Design Intern", "Project Trainee"] },
    { level: "Mid", roles: ["Project Engineer", "R&D Engineer", "Maintenance Lead"] },
    { level: "Senior", roles: ["Chief Engineer", "Engineering Manager", "CTO"] }
  ],
  "Medicine": [
    { level: "Entry", roles: ["Intern Doctor", "Nurse", "Pharmacy Assistant"] },
    { level: "Mid", roles: ["Resident Doctor", "General Physician", "Pharmacist"] },
    { level: "Senior", roles: ["Specialist Doctor", "Hospital Admin", "Surgeon"] }
  ],
  "Law": [
    { level: "Entry", roles: ["Legal Intern", "Junior Advocate", "Legal Assistant"] },
    { level: "Mid", roles: ["Corporate Lawyer", "Litigator", "Compliance Officer"] },
    { level: "Senior", roles: ["Senior Advocate", "Judge", "Legal Advisor"] }
  ],
  "Design & Arts": [
    { level: "Entry", roles: ["Graphic Designer", "UI/UX Trainee", "Fashion Assistant"] },
    { level: "Mid", roles: ["Art Director", "UX Designer", "Fashion Designer"] },
    { level: "Senior", roles: ["Creative Director", "Design Lead", "Animation Supervisor"] }
  ],
  "Education": [
    { level: "Entry", roles: ["Primary Teacher", "Education Intern", "Tutor"] },
    { level: "Mid", roles: ["Lecturer", "Curriculum Developer", "Counselor"] },
    { level: "Senior", roles: ["Professor", "School Principal", "Dean"] }
  ],
  "Social Sciences": [
    { level: "Entry", roles: ["Research Assistant", "Survey Analyst", "NGO Coordinator"] },
    { level: "Mid", roles: ["Policy Analyst", "Psychologist", "Sociologist"] },
    { level: "Senior", roles: ["Director NGO", "Research Lead", "Consultant"] }
  ],
  "Data Science": [
    { level: "Entry", roles: ["Data Analyst", "BI Intern", "Data Engineer"] },
    { level: "Mid", roles: ["ML Engineer", "Data Scientist", "AI Developer"] },
    { level: "Senior", roles: ["Lead Data Scientist", "AI Architect", "CTO"] }
  ],
  "Environmental Studies": [
    { level: "Entry", roles: ["Field Officer", "Eco Research Assistant", "Climate Intern"] },
    { level: "Mid", roles: ["Environmental Consultant", "Sustainability Analyst", "Ecologist"] },
    { level: "Senior", roles: ["Climate Policy Advisor", "NGO Director", "Research Lead"] }
  ],
  "Hospitality & Tourism": [
    { level: "Entry", roles: ["Hotel Staff", "Travel Executive", "Event Coordinator"] },
    { level: "Mid", roles: ["Hotel Manager", "Tour Planner", "Operations Lead"] },
    { level: "Senior", roles: ["GM Hospitality", "Tourism Consultant", "Director Events"] }
  ],
  "Languages & Literature": [
    { level: "Entry", roles: ["Content Writer", "Translator", "Language Tutor"] },
    { level: "Mid", roles: ["Editor", "Author", "Language Specialist"] },
    { level: "Senior", roles: ["Publishing Director", "Creative Head", "Linguist"] }
  ],
  "Architecture": [
    { level: "Entry", roles: ["Design Intern", "Junior Architect", "CAD Drafter"] },
    { level: "Mid", roles: ["Architect", "Urban Planner", "Interior Designer"] },
    { level: "Senior", roles: ["Chief Architect", "Design Director", "Studio Head"] }
  ],
  "Journalism & Media": [
    { level: "Entry", roles: ["Content Creator", "News Trainee", "Video Editor"] },
    { level: "Mid", roles: ["Journalist", "Anchor", "Media Strategist"] },
    { level: "Senior", roles: ["Editor-in-Chief", "News Director", "Media Consultant"] }
  ],
  "Physics & Astronomy": [
    { level: "Entry", roles: ["Lab Assistant", "Telescope Operator", "Research Intern"] },
    { level: "Mid", roles: ["Astrophysicist", "Physics Professor", "R&D Scientist"] },
    { level: "Senior", roles: ["Lead Researcher", "Space Consultant", "NASA Scientist"] }
  ],
  "Mathematics": [
    { level: "Entry", roles: ["Math Tutor", "Quant Intern", "Statistical Analyst"] },
    { level: "Mid", roles: ["Mathematician", "Data Modeler", "Actuary"] },
    { level: "Senior", roles: ["Math Professor", "Research Lead", "Quant Strategist"] }
  ],
  "Biotechnology": [
    { level: "Entry", roles: ["Lab Technician", "Research Intern", "Bio Analyst"] },
    { level: "Mid", roles: ["Biotech Scientist", "Geneticist", "Clinical Researcher"] },
    { level: "Senior", roles: ["R&D Director", "Medical Biotechnologist", "Pharma Scientist"] }
  ],
  "Philosophy & Ethics": [
    { level: "Entry", roles: ["Ethics Assistant", "Teaching Assistant", "Research Intern"] },
    { level: "Mid", roles: ["Philosopher", "Ethics Consultant", "Curriculum Designer"] },
    { level: "Senior", roles: ["Professor", "Think Tank Lead", "Policy Advisor"] }
  ],
  "Political Science": [
    { level: "Entry", roles: ["Political Intern", "Analyst Assistant", "Researcher"] },
    { level: "Mid", roles: ["Policy Analyst", "Political Consultant", "Campaign Manager"] },
    { level: "Senior", roles: ["Diplomat", "Government Strategist", "Ambassador"] }
  ],
  "Chemistry": [
    { level: "Entry", roles: ["Lab Chemist", "QC Assistant", "Chemical Analyst"] },
    { level: "Mid", roles: ["Organic Chemist", "Formulation Scientist", "R&D Chemist"] },
    { level: "Senior", roles: ["Chief Chemist", "Pharma Scientist", "Lab Director"] }
  ],
  "Agricultural Sciences": [
    { level: "Entry", roles: ["Agri Assistant", "Field Technician", "Crop Advisor"] },
    { level: "Mid", roles: ["Agri Consultant", "Farm Manager", "Soil Scientist"] },
    { level: "Senior", roles: ["Agri Economist", "Agri Research Head", "AgroTech CEO"] }
  ],
  "International Relations": [
    { level: "Entry", roles: ["Intern at Embassy", "NGO Intern", "Policy Assistant"] },
    { level: "Mid", roles: ["Diplomatic Analyst", "UN Officer", "Conflict Resolution Expert"] },
    { level: "Senior", roles: ["Ambassador", "Foreign Affairs Advisor", "Global Strategist"] }
  ],
  "Life Sciences": [
    { level: "Entry", roles: ["Lab Assistant", "Bio Technician", "Zoology Intern"] },
    { level: "Mid", roles: ["Botanist", "Zoologist", "Microbiologist"] },
    { level: "Senior", roles: ["Research Director", "Wildlife Scientist", "Biology Professor"] }
  ],
  "Performing Arts": [
    { level: "Entry", roles: ["Performer", "Theatre Intern", "Dance Instructor"] },
    { level: "Mid", roles: ["Actor", "Stage Director", "Music Composer"] },
    { level: "Senior", roles: ["Theatre Director", "Music Director", "Performing Arts Professor"] }
  ],
  "Other Popular Course":[]
  
};

function showCareerPath(courseName) {
  const modal = document.getElementById("careerModal");
  const title = document.getElementById("careerTitle");
  const flow = document.getElementById("careerPathFlow");

  title.textContent = `${courseName} - Career Path`;

  const path = careerPaths[courseName];

  // ✅ Special intro for Other Popular Courses
  if (courseName === "Other Popular Course") {
  const introParagraph = `
  <div style="font-size: 16px; color: #2c3e50; margin-bottom: 24px; line-height: 1.6;">
    <p>
      🌟 <strong>Other Popular Courses</strong> introduce emerging fields that combine creativity, technology, and real-world impact.
    </p>
    <p>
      🔹 <strong>Digital Marketing</strong> leverages analytics, SEO, and social platforms to build brand presence and customer engagement.<br/>
      🔹 <strong>Game Design & Development</strong> blends art and programming to create immersive experiences in the entertainment and education sectors.<br/>
      🔹 <strong>Cybersecurity</strong> focuses on protecting digital systems from threats, making it essential across industries.<br/>
      🔹 <strong>Blockchain Technology</strong> offers decentralized solutions in finance, logistics, and identity verification.<br/>
      🔹 <strong>Fashion Technology</strong> merges innovation with design, bringing tech into the creative world of apparel and textiles.<br/>
      🔹 <strong>Public Health</strong> addresses global health challenges, policy development, and community wellness.<br/>
      🔹 <strong>Aviation & Aerospace Management</strong> prepares professionals for complex roles in flight operations, safety, and airline logistics.
    </p>
  </div>
`;

    flow.innerHTML = introParagraph + Object.entries(path).map(([subCourse, levels]) => `
      <div class="career-subcourse">
        <h3>${subCourse}</h3>
        ${levels.map(level => `
          <div class="career-path-box">
            <h4>${level.level} Level</h4>
            <ul>${level.roles.map(role => `<li>${role}</li>`).join("")}</ul>
          </div>
        `).join("")}
        <hr/>
      </div>
    `).join("");

  } else if (!path) {
    flow.innerHTML = `<p>No career path data available.</p>`;
  } else {
    // Regular course path
    flow.innerHTML = path.map(level => `
      <div class="career-path-box">
        <h3>${level.level} Level</h3>
        <ul>${level.roles.map(role => `<li>${role}</li>`).join("")}</ul>
      </div>
    `).join("");
  }

  modal.classList.remove("hidden");
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card").forEach(card => {
    const courseName = card.dataset.courseName;
    card.addEventListener("click", () => showCareerPath(courseName));
  });

  document.getElementById("closeCareerModal").addEventListener("click", () => {
    document.getElementById("careerModal").classList.add("hidden");
  });
});

