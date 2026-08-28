
    const resources = [
  { 
    title: "📚 Study Materials", 
    description: "Download curated notes, previous year papers, and PDFs.", 
    action: () => showComingSoonPopup("Study Materials") 
  },
  { 
    title: "🧪 Exam Prep", 
    description: "Mock tests, guides & flashcards.", 
    action: () => showComingSoonPopup("Exam Prep") 
  },
  { 
    title: "💸 Scholarships", 
    description: "Find scholarships with eligibility and deadlines.", 
    action: () => showComingSoonPopup("Scholarships") 
  },
  { 
    title: "📄 Resume Builder", 
    description: "Create professional resumes instantly.", 
    action: () => toggleTool('resumeTool') 
  },
  { 
    title: "📊 CGPA Calculator", 
    description: "Convert grade points to CGPA easily.", 
    action: () => toggleTool('cgpaTool') 
  }
];


    const container = document.getElementById("resourceGrid");
    resources.forEach((res) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h2>${res.title}</h2><p>${res.description}</p><button>Explore</button>`;
      card.querySelector('button').addEventListener('click', res.action);
      container.appendChild(card);
    });

    function toggleTool(id) {
      document.querySelectorAll('.tool-section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(id).classList.add('active');
      window.scrollTo({ top: document.getElementById(id).offsetTop, behavior: 'smooth' });
    }

   function generateResume() {
  playClickSound(); // 🔊 Play click sound

  const name = document.getElementById('resName').value.trim();
  const email = document.getElementById('resEmail').value.trim();
  const phone = document.getElementById('resPhone').value.trim();
  const linkedin = document.getElementById('resLinkedIn').value.trim();
  const github = document.getElementById('resGithub').value.trim();
  const summary = document.getElementById('resSummary').value.trim();
  const education = document.getElementById('resEducation').value.trim();
  const skills = document.getElementById('resSkills').value.split(',').map(s => s.trim()).join(', ');
  const projects = document.getElementById('resProjects').value.split('\n').map(p => `<li>${p}</li>`).join('');
  const experience = document.getElementById('resExperience').value.trim();
  const certifications = document.getElementById('resCertifications').value.split('\n').map(c => `<li>${c}</li>`).join('');

  // ✅ Validation for essential fields
  if (!name || !email || !phone) {
    Swal.fire({
      icon: 'warning',
      title: 'Required Fields Missing',
      text: 'Please fill in Name, Email, and Phone fields.',
      confirmButtonColor: 'teal'
    });
    return;
  }

  // 🔄 Show loading spinner
  const spinner = document.getElementById('loadingSpinner');
  spinner.style.display = 'block';
  document.getElementById('resumeOutput').innerHTML = '';

  setTimeout(() => {
    const resumeHTML = `
      <div class="animate__animated animate__fadeInUp" style="max-width: 800px; margin: auto; font-family: 'Segoe UI', sans-serif; color: #222;">
        <div style="border-bottom: 2px solid teal; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 2rem;">${name}</h1>
          <p style="margin: 4px 0;">📧 ${email} | 📞 ${phone}</p>
          <p style="margin: 4px 0;">
            🔗 <a href="${linkedin}" target="_blank">LinkedIn</a> | 💻 <a href="${github}" target="_blank">GitHub</a>
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: teal;">Professional Summary</h2>
          <p>${summary}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: teal;">Education</h2>
          <p>${education}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: teal;">Skills</h2>
          <p>${skills}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: teal;">Projects</h2>
          <ul>${projects}</ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: teal;">Experience</h2>
          <p>${experience}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: teal;">Certifications</h2>
          <ul>${certifications}</ul>
        </div>
      </div>
    `;

    document.getElementById('resumeOutput').innerHTML = resumeHTML;
    spinner.style.display = 'none';

    // 🎉 Confetti explosion
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // ✅ Optional toast notification
    Swal.fire({
      icon: 'success',
      title: 'Resume Ready!',
      text: 'Scroll down to view your generated resume.',
      confirmButtonColor: 'teal',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }, 1000); // Simulate loading delay
}


   function downloadResume() {
  const element = document.getElementById('resumeOutput');
  const opt = {
    margin:       0.5,
    filename:     'resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}function downloadResume() {
  const element = document.getElementById('resumeOutput');

  // Create a clone to avoid affecting visible DOM
  const cloned = element.cloneNode(true);
  cloned.style.width = "800px"; // ensure proper width for PDF
  cloned.style.padding = "20px";
  cloned.style.background = "white";
  cloned.style.fontSize = "12px";

  document.body.appendChild(cloned); // temporarily add it for rendering

  const opt = {
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      scrollY: 0,
      scrollX: 0,
      useCORS: true
    },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(cloned).save().then(() => {
    document.body.removeChild(cloned); // clean up
  });
}



    function calculateCGPA() {
      const gradePoints = parseFloat(document.getElementById('gradePoints').value);
      const totalCredits = parseFloat(document.getElementById('totalCredits').value);
      if (isNaN(gradePoints) || isNaN(totalCredits) || totalCredits === 0) {
        document.getElementById('cgpaResult').innerText = 'Please enter valid values';
        return;
      }
      const cgpa = (gradePoints / totalCredits).toFixed(2);
      Swal.fire({
  title: `🎉 Your SGPA: ${sgpa}`,
  html: `
    <p><b>Total Grade Points:</b> ${totalGradePoints.toFixed(2)}</p>
    <p><b>Total Credits:</b> ${totalCredits}</p>
  `,
  icon: "success",
  confirmButtonText: "Awesome!",
  confirmButtonColor: "#00796b"
  
});

    }
    function showComingSoonPopup(feature) {
  Swal.fire({
    title: `${feature} 🚧`,
    text: "This feature is coming soon. Stay tuned!",
    icon: "info",
    confirmButtonText: "Okay!",
    confirmButtonColor: "teal",
    background: "#fefefe",
    backdrop: `rgba(0,0,0,0.5)`,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
}

function generateSubjectFields() {
  const count = parseInt(document.getElementById('subjectCount').value);
  const container = document.getElementById('subjectInputs');
  container.innerHTML = "";

  if (isNaN(count) || count <= 0) {
    container.innerHTML = "<p style='color:red;'>Please enter a valid number of subjects.</p>";
    return;
  }

  for (let i = 1; i <= count; i++) {
    container.innerHTML += `
      <div style="background:#f9f9f9;border:1px solid #ccc;padding:1rem;border-radius:10px;margin-bottom:1rem;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
        <h4 style="color: teal;">Subject ${i}</h4>
        <input type="text" placeholder="📘 Subject Name" id="subName${i}" />
        <input type="number" placeholder="🎯 Credits" id="credit${i}" min="1" />
        <input type="text" placeholder="🎓 Grade (A+, A, B, etc. or numeric)" id="grade${i}" />
      </div>
    `;
  }
}


function gradeToPoint(grade) {
  const map = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7,
    'C': 6, 'D': 5, 'E': 4, 'F': 0
  };
  if (!isNaN(grade)) return parseFloat(grade); // numeric grade
  return map[grade.toUpperCase()] ?? null;
}

function calculateSGPA() {
  const count = parseInt(document.getElementById('subjectCount').value);
  let totalCredits = 0;
  let totalGradePoints = 0;

  for (let i = 1; i <= count; i++) {
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const grade = document.getElementById(`grade${i}`).value.trim();
    const point = gradeToPoint(grade);

    if (isNaN(credit) || !point && point !== 0) {
      document.getElementById('cgpaResult').innerHTML = `<p style="color:red;">Please enter valid data for Subject ${i}</p>`;
      return;
    }

    totalCredits += credit;
    totalGradePoints += credit * point;
  }

  if (totalCredits === 0) {
    document.getElementById('cgpaResult').innerHTML = `<p style="color:red;">Total credits cannot be zero.</p>`;
    return;
  }

  const sgpa = (totalGradePoints / totalCredits).toFixed(2);

  document.getElementById('cgpaResult').innerHTML = `
    <h3>📘 Result</h3>
    <p>Total Grade Points: <strong>${totalGradePoints.toFixed(2)}</strong></p>
    <p>Total Credits: <strong>${totalCredits}</strong></p>
    <p>Your SGPA is: <strong style="color: teal;">${sgpa}</strong></p>
  `;
  confetti({
  particleCount: 150,
  spread: 90,
  origin: { y: 0.6 }
});
}
function playClickSound() {
  const audio = document.getElementById("clickSound");
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn("Autoplay prevented or audio error:", error);
    });
  }
}
function checkATS() {
  const text = document.getElementById("atsInput").value.trim();
  const result = document.getElementById("atsResult");

  if (!text) {
    result.innerHTML = "❌ Please paste your resume first.";
    return;
  }

  let score = 60;
  if (text.length > 800) score += 15;
  if (text.toLowerCase().includes("experience")) score += 10;
  if (text.toLowerCase().includes("skills")) score += 10;
  if (text.toLowerCase().includes("education")) score += 5;

  score = Math.min(score, 95);

  result.innerHTML = `
    ✅ <strong>ATS Score:</strong> ${score}/100 <br>
    ${score > 80 ? "🎉 Resume is ATS-friendly!" : "⚠ Improve formatting & keywords"}
  `;
}
function suggestCareer() {
  const interest = document.getElementById("careerInterest").value;
  const result = document.getElementById("careerResult");

  if (!interest) {
    result.innerHTML = "❌ Please select an interest.";
    return;
  }

  const paths = {
    "Web Development": "Frontend / Backend Developer, Full Stack Engineer",
    "Artificial Intelligence": "ML Engineer, AI Researcher",
    "Data Science": "Data Analyst, Data Scientist",
    "Cyber Security": "Security Analyst, Ethical Hacker",
    "UI / UX Design": "Product Designer, UX Researcher",
    "Government Exams": "UPSC, SSC, Banking, State PSC"
  };

  result.innerHTML = `
    🚀 <strong>Recommended Paths:</strong><br>
    ${paths[interest] || "Explore skill-based roles"}
  `;
}
function createStudyPlan() {
  const goal = document.getElementById("studyGoal").value.trim();
  const days = document.getElementById("studyDays").value;
  const result = document.getElementById("studyPlanResult");

  if (!goal || !days) {
    result.innerHTML = "❌ Please enter goal and days.";
    return;
  }

  const hoursPerDay = days > 60 ? 3 : 5;

  result.innerHTML = `
    📅 <strong>Study Plan for ${goal}</strong><br>
    ⏱ Study ${hoursPerDay} hours/day<br>
    📘 Weekly revision + mock tests<br>
    🎯 Focus on weak areas every Sunday
  `;
}
function scrollToTool(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  el.classList.add("animate__animated", "animate__pulse");
  setTimeout(() => el.classList.remove("animate__pulse"), 1200);
}
