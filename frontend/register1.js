 (function(){
      if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
        console.error("EmailJS Public Key is missing from environment variables.");
      }
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    })();
function submitForm(event) {
      event.preventDefault();

      const form = document.getElementById("registrationForm");
      const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        webinar: form.webinar.value
      };

      emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID_1, 
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_1, 
          formData
      )
      .then(() => {
        document.getElementById("msg").style.display = "block";
        form.reset();
      }, (error) => {
        alert("❌ Failed to send confirmation email. Please try again.");
        console.error("EmailJS Error:", error);
      });
    }


    