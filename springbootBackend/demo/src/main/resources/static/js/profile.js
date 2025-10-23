fetch('/api/user/profile')
  .then(res => res.json())
  .then(user => {
    const username = user.username;
    const email = user.email;

    document.getElementById('profileUsername').textContent = username;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileInitial').textContent = username.charAt(0).toUpperCase();
  })
  .catch(err => console.error("Error fetching profile:", err));
