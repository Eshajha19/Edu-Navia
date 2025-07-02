 (function(){
      emailjs.init("XNuIdOImhADBCVO2-"); // 🔑 Replace with your EmailJS public key
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

      emailjs.send("service_5e42qtn", "template_xr0hqrk", formData)
      .then(() => {
        document.getElementById("msg").style.display = "block";
        form.reset();
      }, (error) => {
        alert("❌ Failed to send confirmation email. Please try again.");
        console.error("EmailJS Error:", error);
      });
    }