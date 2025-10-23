document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.querySelector("#userTableBody");
  const searchInput = document.querySelector("#searchInput");

  // Mapping role enum to display names
  const roleNames = {
    "ROLE_USER": "User",
    "ROLE_MENTOR": "Mentor",
    "ROLE_CORE": "Core",
    "ROLE_ADMIN": "Admin"
  };

  const roleOptions = [
    { id: 1, name: "ROLE_USER" },
    { id: 2, name: "ROLE_MENTOR" },
    { id: 3, name: "ROLE_CORE" },
    { id: 4, name: "ROLE_ADMIN" }
  ];

  // Fetch users from backend
  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      renderUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      userTableBody.innerHTML = `<tr><td colspan="5">Error loading users</td></tr>`;
    }
  }

  // Render user table
  function renderUsers(users) {
    userTableBody.innerHTML = "";

    users.forEach(user => {
      // Use default role if empty
      const userRole = user.roles.length ? user.roles[0] : "ROLE_USER";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.roles.map(r => roleNames[r] || r).join(", ") || roleNames["ROLE_USER"]}</td>
        <td>
          <select class="role-select" data-id="${user.id}">
            ${roleOptions.map(
              option => `<option value="${option.id}" ${userRole === option.name ? "selected" : ""}>${roleNames[option.name]}</option>`
            ).join("")}
          </select>
        </td>
        <td><button class="update-btn" data-id="${user.id}">Update</button></td>
      `;
      userTableBody.appendChild(row);
    });

    attachRoleChangeListeners();
  }

  // Handle role update
  function attachRoleChangeListeners() {
    const updateBtns = document.querySelectorAll(".update-btn");

    updateBtns.forEach(btn => {
      btn.addEventListener("click", async e => {
        const userId = e.target.dataset.id;
        const select = document.querySelector(`.role-select[data-id='${userId}']`);
        const newRoleId = select.value;

        try {
          const response = await fetch(`/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roleId: newRoleId })
          });

          if (!response.ok) throw new Error("Failed to update role");
          alert("Role updated successfully");
        } catch (error) {
          console.error("Error updating role:", error);
          alert("Failed to update role. Try again.");
        }
      });
    });
  }

  // Search filter
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = userTableBody.querySelectorAll("tr");

    rows.forEach(row => {
      const username = row.cells[0].textContent.toLowerCase();
      const email = row.cells[1].textContent.toLowerCase();
      row.style.display = username.includes(filter) || email.includes(filter) ? "" : "none";
    });
  });

  // Initial fetch
  fetchUsers();
});
