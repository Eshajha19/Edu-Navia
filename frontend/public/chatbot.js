document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");

  // Open chatbot
  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  // Close chatbot
  closeBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  // Send button
  sendBtn.addEventListener("click", sendMessage);

  // Enter key send
  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});


// ===============================
// SEND MESSAGE
// ===============================
function sendMessage() {
  const inputEl = document.getElementById("chatbot-input");
  const userMessage = inputEl.value.trim();

  if (!userMessage) return;

  appendMessage("user", userMessage);
  inputEl.value = "";

  getBotResponse(userMessage);
}


// ===============================
// APPEND MESSAGE UI
// ===============================
function appendMessage(sender, message) {
  const messageContainer = document.getElementById("chatbot-messages");

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}


// ===============================
// TYPING INDICATOR
// ===============================
function showTyping() {
  const messageContainer = document.getElementById("chatbot-messages");

  const typing = document.createElement("div");
  typing.classList.add("message", "bot", "typing");
  typing.id = "typing-indicator";
  typing.textContent = "...";

  messageContainer.appendChild(typing);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}


// ===============================
// GET RESPONSE FROM FLASK BACKEND
// ===============================
async function getBotResponse(userMessage) {
  showTyping();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    removeTyping();

    if (data.reply) {
      appendMessage("bot", data.reply);
    } else {
      appendMessage(
        "bot",
        "Sorry, I couldn't understand the response."
      );
    }
  } catch (error) {
    console.error("Chatbot Error:", error);
    removeTyping();
    appendMessage(
      "bot",
      "Sorry, server connection failed. Please try again."
    );
  }
}