document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.signup-form');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent form from reloading the page
  
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email-id').value.trim();
      const password = document.getElementById('password').value;
  
      // Optional: Basic client-side validation
      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }
  
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
      .then(async (res) => {
        if (res.ok) {
          alert('Signup successful! Redirecting to login page...');
          window.location.href = 'index.html'; // redirect to login page
        } else {
          // Try to parse error message from backend response
          const errorData = await res.json().catch(() => null);
          const errorMessage = errorData?.message || 'Signup failed. Please try again.';
          alert(errorMessage);
        }
      })
      .catch((err) => {
        console.error('Signup error:', err);
        alert('Something went wrong. Please try again later.');
      });
    });
  });
  
  // Your existing togglePassword function can stay here if used
  function togglePassword() {
    const passwordInput = document.getElementById("password");
    const icon = document.querySelector(".toggle-password");
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  }
  