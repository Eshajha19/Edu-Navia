const exams = [
  { name: "JEE Main 2025", date: "2025-04-10T09:00:00", description: "Engineering entrance exam for top institutes in India." },
  { name: "NEET 2025", date: "2025-05-05T09:00:00", description: "Medical entrance exam for MBBS/BDS programs." },
  { name: "CLAT 2025", date: "2025-05-15T09:00:00", description: "Law entrance exam for top law schools in India." },
  { name: "CUET 2025", date: "2025-06-01T09:00:00", description: "Common University Entrance Test for central universities." },
  { name: "CAT 2025", date: "2025-11-24T09:00:00", description: "MBA entrance exam for IIMs and other top B-schools." },
  { name: "SSC CGL 2025", date: "2025-07-20T09:00:00", description: "Combined Graduate Level exam for govt jobs." },
  { name: "GATE 2025", date: "2025-02-02T09:00:00", description: "Graduate Aptitude Test in Engineering for postgrad admissions." },
  { name: "UPSC CSE 2025", date: "2025-08-25T09:00:00", description: "Civil Services Exam for IAS, IPS and more." },
  { name: "NIFT 2025", date: "2025-01-15T09:00:00", description: "Design entrance exam for NIFT institutes." },
  { name: "NID 2025", date: "2025-01-22T09:00:00", description: "Design entrance exam for NID institutes." }
];
function displayExams() {
  const examCards = document.getElementById("examCards");
  examCards.innerHTML = "";
  exams.forEach((exam, idx) => {
    const card = document.createElement("div");
    card.className = "exam-card";
    card.innerHTML = `
      <h3>${exam.name}</h3>
      <p>📅 ${exam.date.split('T')[0]}</p>
      <p>${exam.description}</p>
      <div class="countdown" id="countdown-${idx}">Loading...</div>
      <button class="calendar-btn" onclick="window.open('${generateGoogleCalLink(exam)}', '_blank')">Add to Google Calendar</button>
    `;
    examCards.appendChild(card);
    startCountdown(exam.date, `countdown-${idx}`);
  });
}


function startCountdown(dateStr, id, progressId) {
  const target = new Date(dateStr);
  const total = target - new Date();
  const interval = setInterval(() => {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById(id).innerText = "✅ Exam Day!";
      document.getElementById(progressId).style.width = "100%";
      clearInterval(interval);
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      document.getElementById(id).innerText = `${days}d ${hours}h ${minutes}m`;
      const percent = Math.min(100, 100 - (diff / total) * 100);
      document.getElementById(progressId).style.width = `${percent}%`;
    }
  }, 60000);
}


function generateGoogleCalLink(exam) {
  const start = new Date(exam.date).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endDate = new Date(new Date(exam.date).getTime() + 2 * 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const text = encodeURIComponent(exam.name);
  const details = encodeURIComponent(`${exam.description} (via EduNavigator)`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`;
}

window.onload = displayExams;
