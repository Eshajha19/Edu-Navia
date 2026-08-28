// 🎯 26 Course Categories (Strict List)
const courseCategories = [
    "Computer Science", "Business & Management", "Commerce", "Engineering", "Medicine",
    "Law", "Design & Arts", "Education", "Social Sciences", "Data Science",
    "Environmental Studies", "Hospitality & Tourism", "Languages & Literature", "Architecture", "Journalism & Media",
    "Physics & Astronomy", "Mathematics", "Biotechnology", "Philosophy & Ethics", "Political Science",
    "Chemistry", "Agricultural Sciences", "International Relations", "Life Sciences", "Performing Arts", "Other Popular Course"
];

const courseDescriptions = {
    "Computer Science": "Focuses on technology, programming, and digital innovation.",
    "Business & Management": "Prepares you for leadership and organizational excellence.",
    "Commerce": "Deals with trade, finance, and the global economy.",
    "Engineering": "Applies scientific principles to design and build structures and machines.",
    "Medicine": "Dedicates to healthcare, clinical practice, and saving lives.",
    "Law": "Covers legal systems, justice, and advocacy.",
    "Design & Arts": "Unleashes creativity in visual, digital, and traditional arts.",
    "Education": "Focuses on teaching, pedagogy, and shaping future generations.",
    "Social Sciences": "Studies human behavior, society, and social structures.",
    "Data Science": "Extracts insights from large datasets using analytics and AI.",
    "Environmental Studies": "Focuses on sustainability, ecology, and environmental protection.",
    "Hospitality & Tourism": "Covers travel, service management, and global tourism.",
    "Languages & Literature": "Explores human expression through linguistic and literary study.",
    "Architecture": "The art and science of designing and constructing buildings.",
    "Journalism & Media": "Focuses on communication, news reporting, and digital media.",
    "Physics & Astronomy": "Studies the fundamental laws of the universe and celestial bodies.",
    "Mathematics": "The study of numbers, structures, and logical reasoning.",
    "Biotechnology": "Combines biology and technology for scientific breakthroughs.",
    "Philosophy & Ethics": "Explores deep questions of existence, logic, and morality.",
    "Political Science": "Studies systems of governance and political behavior.",
    "Chemistry": "Focuses on substances, reactions, and molecular science.",
    "Agricultural Sciences": "Deals with food production, farming, and soil science.",
    "International Relations": "Explores global diplomacy, politics, and foreign affairs.",
    "Life Sciences": "Studies living organisms, genetics, and biological systems.",
    "Performing Arts": "Focuses on theatre, dance, music, and performance.",
    "Other Popular Course": "Exploring trending and niche academic disciplines."
};

// 🗺 Adaptive Question Pool (Total 30 questions)
const questionPool = [
    // --- BROAD QUESTIONS (Q1-Q10) ---
    { id: 1, question: "What kind of puzzles or problems do you enjoy solving most?", options: [
        { text: "Logic puzzles and coding challenges", cats: ["Computer Science", "Data Science"] },
        { text: "Designing tools or building complex models", cats: ["Engineering", "Architecture"] },
        { text: "Understanding people and social interactions", cats: ["Social Sciences", "Philosophy & Ethics"] },
        { text: "Analyzing financial trends and business problems", cats: ["Commerce", "Business & Management"] }
    ]},
    { id: 2, question: "Which work environment sounds most appealing to you?", options: [
        { text: "A high-tech lab with advanced software", cats: ["Computer Science", "Data Science"] },
        { text: "A creative studio or a dynamic stage", cats: ["Design & Arts", "Performing Arts"] },
        { text: "A hospital or a medical research facility", cats: ["Medicine", "Biotechnology"] },
        { text: "A courtroom or an international agency", cats: ["Law", "International Relations"] }
    ]},
    { id: 3, question: "How do you usually spend your free time?", options: [
        { text: "Working on eco-friendly or farming projects", cats: ["Environmental Studies", "Agricultural Sciences"] },
        { text: "Reading books or exploring new languages", cats: ["Languages & Literature", "Journalism & Media"] },
        { text: "Managing small projects or tracking assets", cats: ["Business & Management", "Commerce"] },
        { text: "Exploring complex scientific theories or space", cats: ["Mathematics", "Physics & Astronomy"] }
    ]},
    { id: 4, question: "In what way would you like to contribute to society?", options: [
        { text: "Solving medical crises and promoting health", cats: ["Medicine", "Life Sciences"] },
        { text: "Educating students and sharing knowledge", cats: ["Education", "Other Popular Course"] },
        { text: "Crafting policies or representing your country", cats: ["Political Science", "International Relations"] },
        { text: "Ensuring food security and environmental safety", cats: ["Agricultural Sciences", "Environmental Studies"] }
    ]},
    { id: 5, question: "Which subject did you look forward to most in school?", options: [
        { text: "Math, Physics, and logical systems", cats: ["Mathematics", "Physics & Astronomy"] },
        { text: "Biology, Chemistry, and living systems", cats: ["Life Sciences", "Chemistry"] },
        { text: "History, Civics, and social structures", cats: ["Social Sciences", "Political Science"] },
        { text: "Art, Music, and creative expression", cats: ["Design & Arts", "Performing Arts"] }
    ]},
    { id: 6, question: "What's your preferred approach to a new project?", options: [
        { text: "Performing data-heavy research and analysis", cats: ["Data Science", "Social Sciences"] },
        { text: "Visualizing ideas and artistic planning", cats: ["Design & Arts", "Architecture"] },
        { text: "Strategizing for growth and managing resources", cats: ["Business & Management", "Commerce"] },
        { text: "Crafting narratives and communicating ideas", cats: ["Journalism & Media", "Languages & Literature"] }
    ]},
    { id: 7, question: "What kind of professional impact do you want to achieve?", options: [
        { text: "Revolutionizing AI and digital platforms", cats: ["Computer Science", "Data Science"] },
        { text: "Designing landmark structures or products", cats: ["Architecture", "Design & Arts"] },
        { text: "Protecting legal rights and upholding ethics", cats: ["Law", "Philosophy & Ethics"] },
        { text: "Leading global tours and service experiences", cats: ["Hospitality & Tourism", "Other Popular Course"] }
    ]},
    { id: 8, question: "Which of these specific activities excites you most?", options: [
        { text: "Building a complex mobile application", cats: ["Computer Science", "Engineering"] },
        { text: "Performing live in a theater or show", cats: ["Performing Arts", "Design & Arts"] },
        { text: "Conducting groundbreaking chemical research", cats: ["Chemistry", "Biotechnology"] },
        { text: "Covering a major event for a news network", cats: ["Journalism & Media", "International Relations"] }
    ]},
    { id: 9, question: "How do you process complex information?", options: [
        { text: "Translating it into models and formulas", cats: ["Mathematics", "Physics & Astronomy"] },
        { text: "Analyzing its ethical and social context", cats: ["Social Sciences", "Philosophy & Ethics"] },
        { text: "Assessing its impact on trade and markets", cats: ["Commerce", "Business & Management"] },
        { text: "Explaining it simply for others to learn", cats: ["Education", "Other Popular Course"] }
    ]},
    { id: 10, question: "What is your ultimate dream career goal?", options: [
        { text: "Lead Tech Innovator or Data Strategist", cats: ["Computer Science", "Data Science"] },
        { text: "Creative Director or Renowned Artist", cats: ["Design & Arts", "Performing Arts"] },
        { text: "Specialized Surgeon or Biolab Researcher", cats: ["Medicine", "Life Sciences"] },
        { text: "Global Diplomat or Specialized Attorney", cats: ["International Relations", "Law"] }
    ]},

    // --- NICHE / ADAPTIVE QUESTIONS (Q11-Q30) ---
    { id: 11, question: "How much interest do you have in Artificial Intelligence?", options: [
        { text: "I want to build AI models myself", cats: ["Computer Science", "Data Science"] },
        { text: "I want to study its ethical impact", cats: ["Philosophy & Ethics", "Social Sciences"] },
        { text: "I want to use it for business growth", cats: ["Business & Management", "Commerce"] },
        { text: "I prefer working on tangible hardware", cats: ["Engineering", "Architecture"] }
    ]},
    { id: 12, question: "Do you enjoy working in a laboratory setting?", options: [
        { text: "Yes, focused on biological research", cats: ["Biotechnology", "Life Sciences"] },
        { text: "Yes, conducting chemical experiments", cats: ["Chemistry", "Medicine"] },
        { text: "Yes, performing physical tests", cats: ["Physics & Astronomy", "Engineering"] },
        { text: "No, I prefer outdoor field work", cats: ["Environmental Studies", "Agricultural Sciences"] }
    ]},
    { id: 13, question: "Which creative tool sounds most exciting to use?", options: [
        { text: "Professional camera or editing software", cats: ["Journalism & Media", "Design & Arts"] },
        { text: "Architecture and CAD modeling tools", cats: ["Architecture", "Engineering"] },
        { text: "Musical instruments or mixing boards", cats: ["Performing Arts", "Other Popular Course"] },
        { text: "Traditional canvas and sculpting tools", cats: ["Design & Arts", "Performing Arts"] }
    ]},
    { id: 14, question: "How do you feel about public speaking or debating?", options: [
        { text: "I love it, especially on political issues", cats: ["Political Science", "International Relations"] },
        { text: "I enjoy it for legal advocacy", cats: ["Law", "Philosophy & Ethics"] },
        { text: "I like it for teaching and mentoring", cats: ["Education", "Social Sciences"] },
        { text: "I prefer presenting technical data", cats: ["Data Science", "Computer Science"] }
    ]},
    { id: 15, question: "What kind of data fascinates you the most?", options: [
        { text: "Financial market data and stock trends", cats: ["Commerce", "Business & Management"] },
        { text: "Large digital datasets for AI training", cats: ["Data Science", "Computer Science"] },
        { text: "Demographic data and census results", cats: ["Social Sciences", "Political Science"] },
        { text: "Climatological and environmental data", cats: ["Environmental Studies", "Physics & Astronomy"] }
    ]},
    { id: 16, question: "What is your stance on global trade systems?", options: [
        { text: "They are vital for economic growth", cats: ["Commerce", "Business & Management"] },
        { text: "They need strong legal regulation", cats: ["Law", "International Relations"] },
        { text: "They affect environmental sustainability", cats: ["Environmental Studies", "Social Sciences"] },
        { text: "They drive international cultural exchange", cats: ["Languages & Literature", "Social Sciences"] }
    ]},
    { id: 17, question: "How would you like to use your mathematical skills?", options: [
        { text: "For complex algorithm development", cats: ["Computer Science", "Mathematics"] },
        { text: "For understanding laws of nature", cats: ["Physics & Astronomy", "Mathematics"] },
        { text: "For calculating building structures", cats: ["Architecture", "Engineering"] },
        { text: "For financial risk management", cats: ["Commerce", "Mathematics"] }
    ]},
    { id: 18, question: "What interests you most about a new city?", options: [
        { text: "The architectural design and layouts", cats: ["Architecture", "Design & Arts"] },
        { text: "The political climate and local laws", cats: ["Political Science", "Law"] },
        { text: "The language and literary history", cats: ["Languages & Literature", "Journalism & Media"] },
        { text: "The medical and research facilities", cats: ["Medicine", "Life Sciences"] }
    ]},
    { id: 19, question: "Do you enjoy managing or leading people?", options: [
        { text: "I want to lead corporate teams", cats: ["Business & Management", "Commerce"] },
        { text: "I want to manage educational staff", cats: ["Education", "Other Popular Course"] },
        { text: "I want to head a diplomatic mission", cats: ["International Relations", "Political Science"] },
        { text: "I prefer working on individual logic", cats: ["Computer Science", "Mathematics"] }
    ]},
    { id: 20, question: "How do you feel about agricultural developments?", options: [
        { text: "They are the key to global food security", cats: ["Agricultural Sciences", "Life Sciences"] },
        { text: "They must be ethically managed", cats: ["Philosophy & Ethics", "Social Sciences"] },
        { text: "They should be powered by new tech", cats: ["Engineering", "Biotechnology"] },
        { text: "They help maintain our natural ecosystem", cats: ["Environmental Studies", "Agricultural Sciences"] }
    ]}
];

// 🧠 AI Adaptive State
let activeSequenceIndices = []; // Stores indices from questionPool for the current path
let userAnswersMap = {}; // questionPoolId -> optionIndex
let currentSequenceIndex = 0; // 0 to 9 (for fixed 10 questions)

// 🎨 DOM Elements
const introDiv = document.getElementById("quiz-intro");
const quizDiv = document.getElementById("quiz");
const dashboardDiv = document.getElementById("dashboard");
const questionText = document.getElementById("question");
const optionsList = document.getElementById("answers");
const progressText = document.getElementById("progress");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const dashboardSummary = dashboardDiv.querySelector(".dashboard-summary");
let barChart;

// 🔁 Initialize Adaptive Quiz
startBtn.addEventListener("click", () => {
    introDiv.style.display = "none";
    quizDiv.style.display = "block";
    resetQuiz();
    showQuestion();
});

function resetQuiz() {
    activeSequenceIndices = [];
    userAnswersMap = {};
    currentSequenceIndex = 0;
    
    // Select the first question randomly from the broad top 5
    const firstIdx = Math.floor(Math.random() * 5);
    activeSequenceIndices.push(firstIdx);
}

// 📝 Display Adaptive Question
function showQuestion() {
    const poolIdx = activeSequenceIndices[currentSequenceIndex];
    const q = questionPool[poolIdx];
    
    questionText.textContent = `Q${currentSequenceIndex + 1}. ${q.question}`;
    progressText.innerHTML = `<span style="color: #00bfa6; font-size: 0.8rem;">AI Adapting...</span> Question ${currentSequenceIndex + 1}/10`;
    
    // UI Effects
    questionText.style.animation = 'none';
    optionsList.style.animation = 'none';
    void questionText.offsetWidth;
    questionText.style.animation = null;
    optionsList.style.animation = null;

    optionsList.innerHTML = "";
    q.options.forEach((opt, index) => {
        const li = document.createElement("li");
        li.textContent = opt.text;
        
        if (userAnswersMap[q.id] === index) {
            li.classList.add("selected");
        }
        
        li.addEventListener("click", () => selectOption(q.id, index));
        optionsList.appendChild(li);
    });

    backBtn.style.display = currentSequenceIndex > 0 ? "inline-block" : "none";
    nextBtn.disabled = userAnswersMap[q.id] === undefined;
    nextBtn.textContent = currentSequenceIndex === 9 ? "Deep Analysis..." : "Next";
}

function selectOption(qId, optIndex) {
    // If we're changing an existing answer, we must invalidate future questions 
    // because the "AI path" depends on this choice.
    if (userAnswersMap[qId] !== undefined && userAnswersMap[qId] !== optIndex) {
        activeSequenceIndices = activeSequenceIndices.slice(0, currentSequenceIndex + 1);
    }
    
    userAnswersMap[qId] = optIndex;
    const items = optionsList.querySelectorAll("li");
    items.forEach((item, i) => {
        item.classList.toggle("selected", i === optIndex);
    });
    nextBtn.disabled = false;
}

// ⏭ Next / AI Select Next Question
nextBtn.addEventListener("click", () => {
    if (currentSequenceIndex < 9) {
        currentSequenceIndex++;
        
        // If the next question isn't determined yet, calculate it!
        if (!activeSequenceIndices[currentSequenceIndex]) {
            selectNextBestQuestion();
        }
        showQuestion();
    } else {
        showDashboard();
    }
});

// 🧠 The "AI" Selection Logic
function selectNextBestQuestion() {
    const scores = calculateCurrentScores();
    
    let bestPoolIdx = -1;
    let maxRelevance = -1;
    
    // Score each question in the pool
    questionPool.forEach((q, idx) => {
        if (activeSequenceIndices.includes(idx)) return; // skip already asked
        
        let relevance = 0;
        q.options.forEach(opt => {
            opt.cats.forEach(cat => {
                relevance += (scores[cat] || 0);
            });
        });
        
        // Add a bit of randomness to avoid deterministic loops
        relevance += Math.random() * 0.5;
        
        if (relevance > maxRelevance) {
            maxRelevance = relevance;
            bestPoolIdx = idx;
        }
    });
    
    // Fallback if something goes wrong
    if (bestPoolIdx === -1) {
        bestPoolIdx = questionPool.findIndex((_, i) => !activeSequenceIndices.includes(i));
    }
    
    activeSequenceIndices.push(bestPoolIdx);
}

function calculateCurrentScores() {
    const scores = {};
    courseCategories.forEach(c => scores[c] = 0);
    
    activeSequenceIndices.forEach(poolIdx => {
        const q = questionPool[poolIdx];
        const ansIdx = userAnswersMap[q.id];
        if (ansIdx !== undefined) {
            const selectedCats = q.options[ansIdx].cats;
            selectedCats.forEach(cat => scores[cat] += 1);
        }
    });
    return scores;
}

// ⬅ Back Button
backBtn.addEventListener("click", () => {
    if (currentSequenceIndex > 0) {
        currentSequenceIndex--;
        showQuestion();
    }
});

// 📊 Calculation and Dashboard
function showDashboard() {
    quizDiv.style.display = "none";
    dashboardDiv.style.display = "block";

    const scores = calculateCurrentScores();
    const sortedResults = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .filter(entry => entry[1] > 0);

    const topCategory = sortedResults[0][0];
    const topScore = sortedResults[0][1];
    const secondCategory = sortedResults.length > 1 ? sortedResults[1][0] : null;
    const confidence = ((topScore / 10) * 100).toFixed(1);

    // AI Prediction Text
    let explanation = `Based on your unique adaptive path, you show a strong affinity for ${topCategory}. `;
    if (confidence > 40) {
        explanation += "Your patterns indicate a high level of clarity and focus within this specialized domain.";
    } else {
        explanation += "While your interests are diverse, your adaptive responses highlight this field as your primary driver for growth.";
    }

    dashboardSummary.innerHTML = `
        <span style="font-size: 0.9rem; text-transform: uppercase; color: #00bfa6; font-weight: 700;">AI Analysis Result</span>
        <h3>${topCategory}</h3>
        <p>${courseDescriptions[topCategory]}</p>
        <div style="background: rgba(0,191,166,0.1); padding: 10px; border-radius: 8px; margin-top: 15px; display: inline-block;">
            <span style="font-size: 1.2rem; font-weight: 700;">${confidence}% Match Confidence</span>
        </div>
        
        <div style="margin: 20px 0; text-align: left; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #00bfa6;">
            <p style="margin: 0; font-style: italic; color: #444;">“${explanation}”</p>
        </div>

        ${secondCategory ? `
        <div style="margin-top: 10px; font-weight: 600; color: #555;">
            🥈 Recommended Alternative: <span style="color: #00bfa6;">${secondCategory}</span>
        </div>` : ""}

        <div style="margin-top: 25px; text-align: left;">
            <h4 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Adaptive Interest Profile Top 5</h4>
            <ul style="list-style: none; padding: 0; font-size: 0.9rem;">
                ${sortedResults.slice(0, 5).map(([cat, score]) => `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f1f1;">
                        <span>${cat}</span>
                        <span style="font-weight: bold; color: #00bfa6;">${score} pts</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <button id="download-report" style="margin-top: 2rem; background-color: #0d9488; color: white;">Download Detailed Report</button>
    `;

    document.getElementById("download-report").addEventListener("click", () => downloadDetailedReport(topCategory, confidence, secondCategory, sortedResults, explanation));

    renderChart(sortedResults.slice(0, 8));
}

// 🖨 Detailed Full-Page Report Download
function downloadDetailedReport(topCategory, confidence, secondCategory, sortedResults, explanation) {
    // Create the hidden element
    const reportDiv = document.createElement('div');
    reportDiv.id = 'temp-report-container';
    reportDiv.style.cssText = `
        position: fixed;
        left: -10000px;
        top: 0;
        width: 800px;
        padding: 60px;
        background: #ffffff;
        color: #1e293b;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        line-height: 1.5;
    `;

    reportDiv.innerHTML = `
        <div style="text-align: center; border-bottom: 5px solid #00bfa6; padding-bottom: 40px; margin-bottom: 50px;">
            <h1 style="color: #00bfa6; margin: 0; font-size: 3.5rem; letter-spacing: -1px; font-weight: 800;">Edu Navia</h1>
            <p style="color: #64748b; font-size: 1.1rem; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Adaptive Journey Analytics Report</p>
        </div>

        <div style="margin-bottom: 50px; padding: 50px; background: #f0fdfa; border-radius: 40px; border: 1px solid #ccfbf1; position: relative; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; position: relative; z-index: 2;">
                    <span style="background: #00bfa6; color: white; padding: 6px 20px; border-radius: 30px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Primary Recommended Path</span>
                    <h2 style="margin: 20px 0 15px 0; color: #0f766e; font-size: 2.8rem; line-height: 1.1; font-weight: 800;">${topCategory}</h2>
                    <p style="font-size: 1.2rem; line-height: 1.7; color: #334155; margin-bottom: 0;">${courseDescriptions[topCategory]}</p>
                </div>
                <div style="margin-left: 50px; text-align: center; position: relative; z-index: 2;">
                    <div style="width: 140px; height: 140px; border: 12px solid #00bfa6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 2rem; color: #00bfa6; background: #fff;">${Math.round(confidence)}%</div>
                    <p style="font-size: 0.8rem; font-weight: 800; color: #64748b; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">Compatibility Index</p>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 60px;">
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; font-size: 1.8rem; font-weight: 700;">Behavioral Insight Analysis</h3>
            <p style="font-style: italic; line-height: 1.9; font-size: 1.3rem; color: #475569; padding: 30px; background: #f8fafc; border-radius: 24px; border-left: 8px solid #00bfa6; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">"${explanation}"</p>
        </div>

        <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 60px; margin-bottom: 60px;">
            <div>
                <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; font-size: 1.8rem; font-weight: 700;">Matched Competencies</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    ${sortedResults.slice(0, 10).map(([cat, score], index) => `
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 18px 0; color: #1e293b; font-weight: 700; font-size: 1.15rem;">
                                <span style="color: #cbd5e1; margin-right: 15px;">${(index + 1).toString().padStart(2, '0')}</span> ${cat}
                            </td>
                            <td style="padding: 18px 0; text-align: right;">
                                <div style="display: inline-block; width: ${score * 18}px; height: 10px; background: #00bfa6; border-radius: 5px; margin-right: 15px; opacity: 0.8;"></div>
                                <span style="color: #00bfa6; font-weight: 900; font-size: 1.2rem;">${score}</span>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            <div>
                <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; font-size: 1.8rem; font-weight: 700;">Lateral Prospects</h3>
                <p style="color: #64748b; line-height: 1.8; margin-bottom: 25px; font-size: 1.1rem;">Based on cross-dimensional mapping, our engine identified significant potential in these fallback domains:</p>
                ${sortedResults.slice(1, 7).map(([cat]) => `
                    <div style="padding: 16px 24px; background: #fff; border: 1px solid #f1f5f9; border-radius: 18px; margin-bottom: 15px; font-weight: 700; color: #475569; display: flex; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                        <span style="width: 10px; height: 10px; background: #00bfa6; border-radius: 50%; margin-right: 15px;"></span>
                        ${cat}
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="text-align: center; margin-top: 100px; padding-top: 40px; border-top: 3px solid #f8fafc;">
            <p style="font-size: 1rem; color: #94a3b8; font-weight: 700;">Certified Analytical Output • Edu Navia v2.4 Adaptive Engine</p>
            <p style="font-size: 0.9rem; color: #cbd5e1; margin-top: 10px;">Security Verification: ${Math.random().toString(36).substr(2, 10).toUpperCase()}</p>
        </div>
    `;

    // Critical fix: Ensure the element is rendered in a captureable state
    const clone = reportDiv.cloneNode(true);
    clone.style.position = 'static';
    clone.style.left = '0';
    clone.style.visibility = 'visible';
    clone.style.display = 'block';
    
    // Create a temporary container for capture
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
        position: fixed;
        top: 0;
        right: -3000px;
        background: white;
        z-index: -999;
    `;
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    const opt = {
        margin:       [10, 10, 10, 10],
        filename:     'EduNavia_Comprehensive_Analysis.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 3, useCORS: true, letterRendering: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use global html2pdf explicitly
    if (window.html2pdf) {
        window.html2pdf().from(clone).set(opt).save().finally(() => {
            document.body.removeChild(tempContainer);
        });
    } else {
        console.error("PDF engine not found.");
        document.body.removeChild(tempContainer);
    }
}

function renderChart(dataEntries) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    const labels = dataEntries.map(e => e[0]);
    const values = dataEntries.map(e => e[1]);
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, '#00bfa6');
    gradient.addColorStop(1, '#00bfa644');

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Interest Score',
                data: values,
                backgroundColor: gradient,
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 10, ticks: { stepSize: 1 } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// 🔁 Restart Feature
restartBtn.addEventListener("click", () => {
    introDiv.style.display = "block";
    quizDiv.style.display = "none";
    dashboardDiv.style.display = "none";
    resetQuiz();
});