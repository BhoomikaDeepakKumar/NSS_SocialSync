document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8083/api/events/past")
    .then(res => res.json())
    .then(events => {
      const container = document.getElementById("past-events-container");
      container.innerHTML = "";

      events.forEach(event => {
        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">${event.name}</h5>
              <p class="card-text"><strong>Location:</strong> ${event.location}</p>
              <p class="card-text"><strong>Date:</strong> ${event.date}</p>
              <p class="card-text"><strong>Time:</strong> ${event.time}</p>
              <a href="/event-details/${event.id}" class="btn btn-primary mt-2">View Details</a>

            </div>
          </div>
        `;
        container.appendChild(card);
      });

    });



     // Add key listener for Enter on search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        filterEvents();
      }
    });
  }
});


let allEvents = [];
function renderEvents(events) {
  const container = document.getElementById("past-events-container");
  container.innerHTML = ""; // Clear old results
  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text"><strong>Location:</strong> ${event.location}</p>
          <p class="card-text"><strong>Date:</strong> ${event.date}</p>
          <p class="card-text"><strong>Time:</strong> ${event.time}</p>
          <a href="/event-details/${event.id}" class="btn btn-primary mt-2">View Details</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}


function filterEvents() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = allEvents.filter(event =>
    event.name.toLowerCase().includes(query) || event.date.includes(query)
  );
  renderEvents(filtered);
}

function resetSearch() {
  document.getElementById("searchInput").value = "";
  renderEvents(allEvents);
}

// Sample fetch call – modify based on your actual API
fetch("/api/events/past")
  .then(res => res.json())
  .then(data => {
    allEvents = data;
    renderEvents(allEvents);
  })
  .catch(err => console.error("Error fetching events:", err));
