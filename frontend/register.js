// Initialize EmailJS
if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
  console.error("EmailJS Public Key is missing from environment variables.");
}
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

window.submitForm = function(event) {
  event.preventDefault();

  const form = document.getElementById("registrationForm");
  const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    webinar: form.webinar.value
  };

  // 1️⃣ Send Email via EmailJS
  emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID_1, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_1, 
      formData
  )
  .then(() => {
      console.log("Email sent successfully!");

      // 2️⃣ Send WhatsApp via backend
      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(response => {
        if(response.success){
          document.getElementById("msg").style.display = "block";
          document.getElementById("msg").textContent = "✅ Registration successful! Email and WhatsApp confirmation sent.";
          form.reset();
        } else {
          alert("WhatsApp message failed: " + response.error);
        }
      })
      .catch(err => {
        alert("Backend error: " + err);
      });

  }, (error) => {
    alert("❌ Failed to send confirmation email. Please try again.");
    console.error("EmailJS Error:", error);
  });
}
    

    


    