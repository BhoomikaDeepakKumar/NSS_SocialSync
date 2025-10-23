document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.querySelector('section');

  setTimeout(() => {
    signupForm.style.transition = 'opacity 1s ease-in-out';
  }, 500);

  const signupButton = document.querySelector('button');
  signupButton.addEventListener('click', function () {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('passwordcon');

    const isValid =
      emailInput.checkValidity() &&
      passwordInput.checkValidity() &&
      confirmPasswordInput.checkValidity();

    if (!isValid) {
      signupForm.classList.add('shake');
      setTimeout(() => {
        signupForm.classList.remove('shake');
      }, 1000);
    }
  });
});

function togglePassword(icon) {
  const targetId = icon.getAttribute('data-target');
  const input = document.getElementById(targetId);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = "password";
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('passwordcon').value;
  const email = document.getElementById('email').value;

  const data = {
    username,
    email,
    password
  };

  if (password === confirmPassword) {
    fetch('/req/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async response => {
        const message = await response.text();
        console.log("HTTP Status:", response.status);
        console.log("Response message:", message);

        if (response.ok) {
          alert("Signup successful! Please complete your profile.");

          // ✅ Redirect to complete-profile.html with email param
          window.location.href = `/complete-profile?email=${encodeURIComponent(email)}`;
        } else {
          alert("Signup failed: " + (message || "Unknown error occurred."));
        }
      })
      .catch(error => {
        alert("Something went wrong: " + error);
      });
  } else {
    alert("Passwords do not match!");
  }
});
