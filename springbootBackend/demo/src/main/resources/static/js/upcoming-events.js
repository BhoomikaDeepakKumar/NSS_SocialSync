document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8083/api/events/upcoming") // Adjust if using a different port
    .then((response) => response.json())
    .then((events) => {
      const container = document.getElementById("upcoming-events-list");
      container.innerHTML = "";

      if (events.length === 0) {
        container.innerHTML = "<p>No upcoming events found.</p>";
        return;
      }

      events.forEach((event) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4"; // Bootstrap grid layout

        col.innerHTML = `
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <h4 class="card-title">${event.name}</h4>
      <p class="card-text"><strong>Location:</strong> ${event.location}</p>
      <p class="card-text"><strong>Date:</strong> ${event.date}</p>
      <p class="card-text"><strong>Time:</strong> ${event.time}</p>
      <button class="view-details-btn" onclick="toggleDetails(this)">View Details</button>
      <div class="event-details">
        <p>${event.description}</p>
      </div>
    </div>
  </div>
`;

        container.appendChild(col);

      });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
});

function toggleDetails(button) {
  const details = button.nextElementSibling;
  details.style.display = details.style.display === "block" ? "none" : "block";
}
