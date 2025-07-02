// Typing Effect for Title
document.addEventListener("DOMContentLoaded", () => {
  const typingElement = document.getElementById("typingText");
  const texts = ["Meet Our Developers", "Crafted with Passion", "Edu Navia Team"];
  let i = 0;
  let index = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const delay = 1500;

  function typeLoop() {
    const currentText = texts[i % texts.length];

    if (!isDeleting && index < currentText.length) {
      typingElement.textContent += currentText.charAt(index++);
      setTimeout(typeLoop, typingSpeed);
    } else if (!isDeleting && index === currentText.length) {
      isDeleting = true;
      setTimeout(typeLoop, delay);
    } else if (isDeleting && index > 0) {
      typingElement.textContent = currentText.substring(0, --index);
      setTimeout(typeLoop, erasingSpeed);
    } else {
      isDeleting = false;
      i++;
      setTimeout(typeLoop, delay);
    }
  }

  typeLoop();
});

// Toggle developer description on click
function toggleDescription(card) {
  const desc = card.querySelector(".developer-description");

  // Hide other open descriptions
  document.querySelectorAll(".developer-description").forEach(el => {
    if (el !== desc) el.classList.remove("show");
  });

  // Toggle this one
  desc.classList.toggle("show");
}

const modal = document.getElementById("devModal");
const modalBody = document.getElementById("modalBody");

function openModal(dev) {
  const content = {
    eshita: `
      <h3>👩‍💻 Eshita Jha – Frontend Engineer & UI Designer</h3>
      <p>I am a second-year B.Tech student at Galgotias College of Engineering and Technology, currently pursuing a degree in Artificial Intelligence and Data Science.</p><br>
      <p>As a Frontend Developer and UI/UX Designer in the Edu Navia project,My key contributions included building the navigation bar, animated hero section, responsive card sliders, rating modals, chatbot UI, and user forms like login and registration — all styled with a cohesive and professional theme.</p><br>
      <p>I was also responsible for ensuring cross-browser compatibility, mobile responsiveness, and modern animation effects that enhanced user engagement. Beyond design, I integrated dynamic content with Firebase and contributed to data flow validation for smoother interactivity.</p><br>
      <p>I take pride in building visually polished, accessible, and user-centric interfaces that truly empower students to explore and make informed decisions through Edu Navia.</p><br>
    `,
    esha: `
      <h3>👩‍💻 Esha Jha – Backend Developer & Firebase Expert</h3>
      <p>I am a second-year B.Tech student at Galgotias College of Engineering and Technology, currently enrolled in the Artificial Intelligence.</p><br>
      <p>As the Backend Developer and Firebase Specialist in the Edu Navia team, I architected and implemented the backend systems that power our platform. I managed the entire Firebase stack — from Authentication to Cloud Firestore, enabling secure login, real-time data syncing, dynamic content fetching, and user feedback storage.</p><br>
      <p>I developed and optimized key modules like the university comparison engine, exam tracker, consulting form backend, and user rating management, all of which are fully integrated with Firebase. My role extended to designing efficient data schemas, writing scalable logic, and ensuring smooth communication between frontend components and database layers.</p><br>
      <p>I also supported debugging, mobile optimization, and contributed to styling consistency. My priority was to ensure that users experience fast, secure, and reliable access to information — all driven by a robust backend foundation.</p><br>
    `,
    shreyshi: `
      <h3>👩‍💻 Shreyshi Sriwastav – Frontend Developer & Layout Specialist</h3>
      <p>I am a second-year B.Tech student from Galgotias College of Engineering and Technology, specializing in Information Technology.</p><br>
      <p>As a Frontend Developer and Layout Specialist for the Edu Navia project, I played a crucial role in building structured, clean, and highly responsive interfaces. My work focused on refining page-level designs, consistent spacing, section alignment, and ensuring that the user journey flows naturally.</p><br>
      <p>I contributed heavily to the tools grid, about pages, feedback/rating layout, and helped with component styling across the site. My design philosophy centers on clarity, responsiveness, and ease of navigation — especially on mobile devices, where many students will access the platform.</p><br>
      <p>I worked closely with the team to ensure a consistent design system and helped debug layout and spacing issues for a visually polished experience. I’m passionate about creating accessible designs that support students in discovering academic paths aligned with their interests.</p>
    `
  };

  modalBody.innerHTML = content[dev];
  modal.classList.remove("hidden");
  modal.style.display = "flex";
}

function closeModal() {
  modal.classList.add("hidden");
  modal.style.display = "none";
}
