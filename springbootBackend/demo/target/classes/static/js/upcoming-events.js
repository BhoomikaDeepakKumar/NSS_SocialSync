let allEvents = [];

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

    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h4 class="card-title">${event.name}</h4>
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
