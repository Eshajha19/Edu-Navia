
function submitForm(event) {
      event.preventDefault();

      const form = document.getElementById("registrationForm");
      const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        webinar: form.webinar.value
      };

      emailjs.send()
      .then(() => {
        document.getElementById("msg").style.display = "block";
        form.reset();
      }, (error) => {
        alert("❌ Failed to send confirmation email. Please try again.");
        console.error("EmailJS Error:", error);
      });
    }

