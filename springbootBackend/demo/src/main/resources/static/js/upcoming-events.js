let allEvents = [];
let isEditMode = false;
let selectedEventIds = new Set();


document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8083/api/events/upcoming")
    .then((response) => response.json())
    .then((events) => {
      allEvents = events;
      renderEvents(allEvents);
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });

  // Live filter on every keystroke
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", filterEvents);
}

});

function renderEvents(events) {
  const container = document.getElementById("upcoming-events-list");
  container.innerHTML = "";

  if (!events.length) {
    container.innerHTML = "<p>No upcoming events found.</p>";
    return;
  }

  events.forEach((event) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const checkbox = isEditMode
      ? `<input type="checkbox" class="event-checkbox form-check-input mb-2" data-id="${event.eventId}" onchange="toggleSelection(this)">`
      : "";

    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
  <h4 class="card-title mb-0">${event.name}</h4>
  ${checkbox}
</div>

          <p class="card-text"><strong>Location:</strong> ${event.location}</p>
          <p class="card-text"><strong>Date:</strong> ${event.date}</p>
          <p class="card-text"><strong>Time:</strong> ${event.time}</p>
          <button class="view-details-btn" onclick="toggleDetails(this)">View Details</button>
          <div class="event-details" style="display: none;">
            <p>${event.description}</p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}


function toggleEditMode() {
  isEditMode = true;
  selectedEventIds.clear();
  document.getElementById("editModeBtn").style.display = "none";
  document.getElementById("deleteSelectedBtn").style.display = "inline-block";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
  renderEvents(allEvents); // re-render with checkboxes
}

function cancelEditMode() {
  isEditMode = false;
  selectedEventIds.clear();
  document.getElementById("editModeBtn").style.display = "inline-block";
  document.getElementById("deleteSelectedBtn").style.display = "none";
  document.getElementById("cancelEditBtn").style.display = "none";
  renderEvents(allEvents); // re-render without checkboxes
}
function toggleSelection(checkbox) {
  const id = parseInt(checkbox.getAttribute("data-id"));
  if (checkbox.checked) {
    selectedEventIds.add(id);
  } else {
    selectedEventIds.delete(id);
  }
}


function toggleEventSelection(eventId, isSelected) {
  if (isSelected) {
    selectedEvents.add(eventId);
  } else {
    selectedEvents.delete(eventId);
  }
}

function deleteSelectedEvents() {
  if (selectedEventIds.size === 0) {
    alert("Please select at least one event to delete.");
    return;
  }

  if (!confirm("Are you sure you want to delete selected events?")) return;

  const promises = [...selectedEventIds].map((id) =>
    fetch(`http://localhost:8083/api/events/${id}`, {
      method: "DELETE",
    })
  );

  Promise.all(promises)
    .then(() => {
      // Refresh event list
      allEvents = allEvents.filter((event) => !selectedEventIds.has(event.eventId));
      selectedEventIds.clear();
      cancelEditMode();
      alert("Selected events deleted successfully.");
    })
    .catch((err) => {
      console.error("Error deleting events:", err);
      alert("Something went wrong while deleting.");
    });
}



function filterEvents() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  const filtered = allEvents.filter(event =>
    event.name.toLowerCase().includes(query) ||
    event.date.toLowerCase().includes(query) // Matches parts of the date like "2025-07"
  );

  renderEvents(filtered);
}


function resetSearch() {
  document.getElementById("searchInput").value = "";
  renderEvents(allEvents);
}

function toggleDetails(button) {
  const details = button.nextElementSibling;
  details.style.display = details.style.display === "block" ? "none" : "block";
}
