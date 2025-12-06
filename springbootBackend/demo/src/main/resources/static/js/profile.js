let currentUserEmail = "";

document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.querySelector(".edit-btn");
  let isEditing = false;

  // Your existing API
  const PROFILE_API = "/api/user/profile";

  // Elements mapped for toggling edit mode
  const fields = {
    fullName: ["profileName", "profileNameInput"],
    course: ["profileCourse", "profileCourseInput"],
    semester: ["semester", "semesterInput"],
    contact: ["profileContact", "profileContactInput"],
    affiliation: ["profileRole", "profileRoleInput"],
  };

  // ⭐ Load profile on page start
  fetch(PROFILE_API)
  .then((res) => res.json())
  .then((user) => {
    currentUserEmail = user.email; // store email for PUT request
    fillStaticProfile(user);
    fillEditableFields(user);
  })
    .catch((err) => console.error("Error fetching profile:", err));

  // ---------------------------------------------------------------------------------------------
  // FILL DATA (STATIC)
  // ---------------------------------------------------------------------------------------------
  function fillStaticProfile(user) {
    const username = user.username || "";
    const email = user.email || "";

    document.getElementById("profileUsername").textContent = username;
    document.getElementById("profileEmail").textContent = email;

    // If you ever add profileInitial again:
    const initialElem = document.getElementById("profileInitial");
    if (initialElem) {
      initialElem.textContent = username.charAt(0).toUpperCase();
    }

    document.getElementById("profileName").textContent = user.fullName || "";
    document.getElementById("volunteerId").textContent = user.volunteerId || "";
    document.getElementById("profileCourse").textContent = user.course || "";
    document.getElementById("semester").textContent = user.semester || "";
    document.getElementById("profileContact").textContent = user.contact || "";
    document.getElementById("profileRole").textContent = user.affiliation || "";
  }

  // ---------------------------------------------------------------------------------------------
  // PREFILL INPUT FIELDS (EDIT MODE)
  // ---------------------------------------------------------------------------------------------
  function fillEditableFields(user) {
    document.getElementById("profileNameInput").value = user.fullName || "";
    document.getElementById("profileCourseInput").value = user.course || "";
    document.getElementById("semesterInput").value = user.semester || "";
    document.getElementById("profileContactInput").value = user.contact || "";
    document.getElementById("profileRoleInput").value = user.affiliation || "Volunteer";
  }

  // ---------------------------------------------------------------------------------------------
  // EDIT BUTTON LOGIC
  // ---------------------------------------------------------------------------------------------
  editBtn.addEventListener("click", () => {
    isEditing = !isEditing;

    if (isEditing) {
  enableEditing();
  editBtn.textContent = "Save";
  editBtn.classList.add("save-mode");
} else {
  saveProfile();
  editBtn.textContent = "Edit";
  editBtn.classList.remove("save-mode");
}
  });

  // ---------------------------------------------------------------------------------------------
  // ENABLE INPUT MODE
  // ---------------------------------------------------------------------------------------------
  function enableEditing() {
    Object.values(fields).forEach(([spanId, inputId]) => {
      const span = document.getElementById(spanId);
      const input = document.getElementById(inputId);

      if (input) {
        span.style.display = "none";
        input.style.display = "inline-block";
      }
    });
  }

  // ---------------------------------------------------------------------------------------------
  // DISABLE INPUT MODE
  // ---------------------------------------------------------------------------------------------
  function disableEditing() {
    Object.values(fields).forEach(([spanId, inputId]) => {
      const span = document.getElementById(spanId);
      const input = document.getElementById(inputId);

      if (input) {
        span.style.display = "inline";
        input.style.display = "none";

        // Reflect new values in static labels
        span.textContent = input.value;
      }
    });
  }

  // ---------------------------------------------------------------------------------------------
  // SAVE UPDATED DATA
  // ---------------------------------------------------------------------------------------------
  function saveProfile() {
    const updatedData = {
      fullName: document.getElementById("profileNameInput").value,
      course: document.getElementById("profileCourseInput").value,
      semester: document.getElementById("semesterInput").value,
      contact: document.getElementById("profileContactInput").value,
      affiliation: document.getElementById("profileRoleInput").value,
    };

    fetch(`/api/users/update-profile/${currentUserEmail}`, {  // ✔ use correct controller URL
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updatedData),
})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
      })
      .then((updatedUser) => {
        fillStaticProfile(updatedUser);
        fillEditableFields(updatedUser);
        disableEditing();

        alert("Profile updated successfully! 🎉");
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        alert("Could not update profile. Please try again.");
      });
  }
});
