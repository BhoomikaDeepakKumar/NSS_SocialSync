document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.querySelector('section');


  setTimeout(() => {
    signupForm.style.transition = 'opacity 1s ease-in-out';
  }, 500);

  const signupButton = document.querySelector('button');
  signupButton.addEventListener('click', function () {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const confirmPasswordInput = document.querySelector('input[type="password"][name="confirm-password"]');

    // Check for a valid email and password (you can add your validation logic here)
    const isValid = emailInput.checkValidity() && passwordInput.checkValidity() && confirmPasswordInput.checkValidity();

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
      .then(response => {
        console.log("HTTP Status:", response.status); // log status
        return response.text().then(message => {
          console.log("Response message:", message); // log body

          if (response.ok) {
            alert(message);
            window.location.href = '/req/login';
          } else {
            alert("Signup failed: " + (message || "Unknown error occurred."));
          }
        });
      })

      .catch(error => {
        alert("Something went wrong: " + error);
      });
  } else {
    alert("Passwords do not match!");
  }
});
