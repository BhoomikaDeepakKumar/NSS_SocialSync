document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.querySelector("#userTableBody");
  const searchInput = document.querySelector("#searchInput");

 
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const userId = e.target.dataset.id;
    console.log("Edit user:", userId);
  }
});


  // Fetch users from backend
  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      renderUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      userTableBody.innerHTML = `<tr><td colspan="6">Error loading users</td></tr>`;
    }
  }

  // Render user table
  function renderUsers(users) {
    userTableBody.innerHTML = "";

    users.forEach(user => {
      // Use default role if empty
      const userRole = user.roles.length ? user.roles[0] : "ROLE_USER";

      const row = document.createElement("tr");
      row.dataset.userId = user.id;

row.innerHTML = `
  <td><input type="checkbox" class="user-checkbox" data-id="${user.id}" /></td>
  <td>${user.fullName || "-"}</td>
  <td>${user.email}</td>
  <td>${user.volunteerId || "-"}</td>
  <td>${user.roles.length ? user.roles[0].replace("ROLE_", "") : "User"}</td>
  <td><button class="edit-btn" data-id="${user.id}">Edit</button></td>
`;
      userTableBody.appendChild(row);
    });

   
  }

  

  // Search filter
  searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = userTableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const fullName = row.cells[0].textContent.toLowerCase();
    const email = row.cells[1].textContent.toLowerCase();
    const volunteerId = row.cells[2].textContent.toLowerCase();
    row.style.display = fullName.includes(filter) || email.includes(filter) || volunteerId.includes(filter) ? "" : "none";
  });
});

  // Initial fetch
  fetchUsers();
});

const selectAll = document.getElementById("selectAllUsers");
selectAll.addEventListener("change", (e) => {
  document.querySelectorAll(".user-checkbox").forEach(cb => cb.checked = e.target.checked);
});

document.getElementById("applyBulkActionBtn").addEventListener("click", async () => {
  const action = document.getElementById("bulkActionSelect").value;
  const selectedUsers = Array.from(document.querySelectorAll(".user-checkbox:checked"))
                            .map(cb => parseInt(cb.closest("tr").dataset.userId));

  if (!action || selectedUsers.length === 0) {
    alert("Select an action and at least one user");
    return;
  }

  try {
    const res = await fetch("/api/users/bulk-action?action=" + action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUsers)
    });

    if (res.ok) {
      alert("Bulk action completed successfully!");
      fetchUsers(); // refresh table
    } else {
      const text = await res.text();
      alert("Error: " + text);
    }
  } catch (err) {
    console.error(err);
    alert("Server error!");
  }
});



//add single user

document.addEventListener("DOMContentLoaded", () => {
  
  const addSingleUserBtn = document.querySelector("#addSingleUserBtn");
  const singleUserFormOverlay = document.querySelector("#singleUserFormOverlay");
  const cancelSingleUser = document.querySelector("#cancelSingleUser");
  const singleUserForm = document.querySelector("#singleUserForm");

  // 👉 Show form
  addSingleUserBtn.addEventListener("click", () => {
    singleUserFormOverlay.classList.remove("hidden");
  });

  // 👉 Hide form
  cancelSingleUser.addEventListener("click", () => {
    singleUserFormOverlay.classList.add("hidden");
  });

  // 👉 Submit form
  singleUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
      fullName: document.querySelector("#fullName").value.trim(),
      email: document.querySelector("#email").value.trim(),
       password: document.querySelector("#password").value.trim(),
      course: document.querySelector("#course").value.trim(),
      semester: document.querySelector("#semester").value.trim(),
      contact: document.querySelector("#contact").value.trim(),
      affiliation: document.querySelector("#affiliation").value
    };

    console.log("Sending new user:", userData);

    // 🔥 send to backend
    try {
      const res = await fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        alert("User added successfully!");
        singleUserForm.reset();
        singleUserFormOverlay.classList.add("hidden");

        // optionally refresh table
        fetchUsers();
      } else {
        alert("Error adding user!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  });

});
