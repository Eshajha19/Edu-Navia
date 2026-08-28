
  document.addEventListener("DOMContentLoaded", () => {
    const voiceBtn = document.getElementById("voiceBtn");
    const searchInput = document.getElementById("searchInput");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && voiceBtn && searchInput) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.innerText = "🎙️ Listening...";
      });

      recognition.onresult = (event) => {
        const rawTranscript = event.results[0][0].transcript.toLowerCase().trim();
        const transcript = rawTranscript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");

        searchInput.value = transcript;
        searchInput.dispatchEvent(new Event("input"));  // ✅ triggers search
        voiceBtn.innerText = "🎤";
      };

      recognition.onerror = (event) => {
        console.error("Voice error:", event.error);
        voiceBtn.innerText = "🎤";
      };

      recognition.onend = () => {
        voiceBtn.innerText = "🎤";
      };
    } else {
      console.warn("SpeechRecognition not supported or elements missing.");
      if (voiceBtn) voiceBtn.disabled = true;
    }
  });

