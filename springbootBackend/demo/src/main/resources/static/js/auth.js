document.querySelector(".login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }
  
    // Replace this with actual backend login call
    alert(`Logging in as ${email}`);
  });
  