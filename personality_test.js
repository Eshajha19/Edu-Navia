 // Course descriptions (24 courses)
    const courseDescriptions = {
      cs: { name: "Computer Science", desc: "Study of computers, programming, and algorithms." },
      engineering: { name: "Engineering", desc: "Design and build machines and structures." },
      medicine: { name: "Medicine", desc: "Healthcare and medical sciences." },
      theatre: { name: "Theatre and Performing Arts", desc: "Acting, drama, and performance arts." },
      environment: { name: "Environmental Science", desc: "Study of environment and sustainability." },
      statistics: { name: "Statistics", desc: "Analyzing data and probability." },
      law: { name: "Law", desc: "Study of legal systems and justice." },
      psychology: { name: "Psychology", desc: "Human mind and behavior studies." },
      journalism: { name: "Journalism", desc: "News, media, and communication." },
      architecture: { name: "Architecture", desc: "Designing buildings and spaces." },
      languages: { name: "Languages", desc: "Learning foreign languages and linguistics." },
      music: { name: "Music", desc: "Musical theory and performance." },
      philosophy: { name: "Philosophy", desc: "Critical thinking and logic." },
      chemistry: { name: "Chemistry", desc: "Study of chemicals and reactions." },
      physics: { name: "Physics", desc: "Study of nature and laws of universe." },
      education: { name: "Education", desc: "Teaching and learning sciences." },
      economics: { name: "Economics", desc: "Financial markets and economy." },
      graphicDesign: { name: "Graphic Design", desc: "Visual design and creativity." },
      marketing: { name: "Marketing", desc: "Business communication and promotion." },
      history: { name: "History", desc: "Study of past cultures and events." },
      arts: { name: "Arts and Humanities", desc: "Social sciences and humanities." },
      business: { name: "Business Management", desc: "Management and business studies." },
      design: { name: "Art and Design", desc: "Creative visual arts and design." },
      sociology: { name: "Sociology", desc: "Social behavior and society studies." }
    };

    // 25 Questions covering all courses with scale or choice types
    const questions = [
      {question: "How interested are you in technology and programming?", type: "scale", course:"cs"},
      {question: "Do you like solving complex problems and building machines?", type: "scale", course:"engineering"},
      {question: "Are you passionate about helping people and healthcare?", type: "scale", course:"medicine"},
      {question: "Do you enjoy creative storytelling or performing arts?", type: "scale", course:"theatre"},
      {question: "Are you interested in environmental issues and sustainability?", type: "scale", course:"environment"},
      {question: "Do you prefer working with numbers and data analysis?", type: "scale", course:"statistics"},
      {question: "Is law and justice something that excites you?", type: "scale", course:"law"},
      {question: "Are you curious about human behavior and psychology?", type: "scale", course:"psychology"},
      {question: "Do you like writing, news, or journalism?", type: "scale", course:"journalism"},
      {question: "Are you interested in designing buildings or spaces?", type: "scale", course:"architecture"},
      {question: "Do you enjoy learning foreign languages?", type: "scale", course:"languages"},
      {question: "Are you drawn to music and musical performance?", type: "scale", course:"music"},
      {question: "Is philosophy or deep critical thinking your thing?", type: "scale", course:"philosophy"},
      {question: "Are you fascinated by chemistry and lab experiments?", type: "scale", course:"chemistry"},
      {question: "Do you enjoy physics and understanding nature's laws?", type: "scale", course:"physics"},
      {question: "Would you like a career in teaching and education?", type: "scale", course:"education"},
      {question: "Are you interested in economics and financial markets?", type: "scale", course:"economics"},
      {question: "Do you enjoy graphic design and visual creativity?", type: "scale", course:"graphicDesign"},
      {question: "Are you keen on marketing and business communication?", type: "scale", course:"marketing"},
      {question: "Do you like history and studying past cultures?", type: "scale", course:"history"},
      {question: "Do you enjoy social sciences and humanities?", type: "scale", course:"arts"},
      {question: "Are you interested in business and management?", type: "scale", course:"business"},
      {question: "Do you appreciate aesthetic and creative arts?", type: "scale", course:"design"},
      {question: "Are you curious about societal behaviors and social structures?", type: "scale", course:"sociology"},
      {question: "Would you like to explore computer science and IT careers more deeply?", type: "scale", course:"cs"}
    ];

    let userScores = {};
    let currentQuestion = 0;

    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");
    const quizIntro = document.getElementById("quiz-intro");
    const quiz = document.getElementById("quiz");
    const dashboard = document.getElementById("dashboard");
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    const scaleEl = document.getElementById("scale");
    const dashboardSummary = dashboard.querySelector(".dashboard-summary");
    let barChart;

    function initScores() {
      userScores = {};
      Object.keys(courseDescriptions).forEach(course => userScores[course] = 0);
    }

    function showQuestion() {
      nextBtn.disabled = true;
      scaleEl.style.display = "none";
      answersEl.innerHTML = "";
      const q = questions[currentQuestion];
      questionEl.textContent = `Q${currentQuestion + 1}. ${q.question}`;

      if (q.type === "choice") {
        q.answers.forEach(answer => {
          const li = document.createElement("li");
          li.textContent = answer.text;
          li.dataset.value = answer.value;
          li.addEventListener("click", () => {
            [...answersEl.children].forEach(c => c.classList.remove("selected"));
            li.classList.add("selected");
            nextBtn.disabled = false;
            Object.keys(userScores).forEach(c => userScores[c] = userScores[c]);
            Object.keys(userScores).forEach(c => {
              if(c === answer.value) userScores[c] += 2;
            });
          });
          answersEl.appendChild(li);
        });
      } else if (q.type === "scale") {
        scaleEl.style.display = "flex";
        scaleEl.innerHTML = "";
        for(let i=1; i<=5; i++) {
          const btn = document.createElement("button");
          btn.textContent = i;
          btn.className = "scale-btn";
          btn.addEventListener("click", () => {
            [...scaleEl.children].forEach(c => c.classList.remove("selected"));
            btn.classList.add("selected");
            nextBtn.disabled = false;
            Object.keys(userScores).forEach(c => userScores[c] = userScores[c]);
            userScores[q.course] += i;
          });
          scaleEl.appendChild(btn);
        }
      }
    }

    function showDashboard() {
      quiz.style.display = "none";
      dashboard.style.display = "block";

      // Sort courses by score descending
      const sortedCourses = Object.entries(userScores)
        .sort((a,b) => b[1] - a[1]);

      // Chart data
      const labels = sortedCourses.map(c => courseDescriptions[c[0]].name);
      const scores = sortedCourses.map(c => c[1]);

      // Prepare gradient fill for bars
      const ctx = document.getElementById('barChart').getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 350);
      gradient.addColorStop(0, 'rgba(0, 191, 166, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 191, 166, 0.3)');

      if(barChart) {
        barChart.destroy();
      }

      barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Interest Level',
            data: scores,
            backgroundColor: gradient,
            borderRadius: 10,
            maxBarThickness: 40,
            hoverBackgroundColor: 'rgba(0, 191, 166, 1)'
          }]
        },
        options: {
          animation: {
            duration: 1500,
            easing: 'easeOutQuart',
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 40,
              grid: {
                color: '#e1e7ec'
              },
              ticks: {
                color: '#555',
                font: { size: 14 }
              }
            },
            x: {
              ticks: {
                color: '#444',
                font: { size: 13 },
                maxRotation: 45,
                minRotation: 30,
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const key = sortedCourses[ctx.dataIndex][0];
                  return `${courseDescriptions[key].name}: ${ctx.parsed.y}`;
                },
                afterLabel: ctx => {
                  const key = sortedCourses[ctx.dataIndex][0];
                  return courseDescriptions[key].desc;
                }
              },
              backgroundColor: '#00bfa6',
              titleFont: { size: 16, weight: 'bold' },
              bodyFont: { size: 14 },
              padding: 10,
              cornerRadius: 8
            }
          }
        }
      });

      // Show top course as a card
      const [topCourseKey, topScore] = sortedCourses[0];
      dashboardSummary.innerHTML = `
        <h3>Top Recommended Course</h3>
        <div class="top-result-card">
          <h3>${courseDescriptions[topCourseKey].name}</h3>
          <p>${courseDescriptions[topCourseKey].desc}</p>
        </div>
        <hr />
        <h4>All Course Scores:</h4>
        <ul>
          ${sortedCourses.map(([key, score]) => `<li>${courseDescriptions[key].name}: ${score}</li>`).join('')}
        </ul>
      `;
    }

    startBtn.addEventListener("click", () => {
      quizIntro.style.display = "none";
      quiz.style.display = "block";
      dashboard.style.display = "none";
      currentQuestion = 0;
      initScores();
      showQuestion();
    });

    nextBtn.addEventListener("click", () => {
      currentQuestion++;
      if(currentQuestion < questions.length){
        showQuestion();
      } else {
        showDashboard();
      }
    });

    restartBtn.addEventListener("click", () => {
      quizIntro.style.display = "block";
      quiz.style.display = "none";
      dashboard.style.display = "none";
      currentQuestion = 0;
      initScores();
    });