let editMode = false;
let selectedEventIds = new Set();


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



  const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", filterEvents);
}



});


let allEvents = [];
function renderEvents(events) {
  const container = document.getElementById("past-events-container");
  container.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "col-md-4";

 card.innerHTML = `
  <div class="card shadow-sm h-100 p-0">
    <div class="card-body p-0 px-3 pt-3 pb-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
  <h5 class="card-title mb-0">${event.name}</h5>
  ${editMode ? `
    <input type="checkbox" class="form-check-input ms-2 event-checkbox" data-id="${event.id}" onchange="toggleSelect(${event.id}, this.checked)" />
  ` : ""}
</div>

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

function toggleEditMode() {
  editMode = true;
  document.getElementById('deleteSelectedBtn').style.display = 'inline-block';
  document.getElementById('editModeBtn').style.display = 'none';
  document.getElementById('cancelEditBtn').style.display = 'inline-block';
  renderEvents(allEvents);
}

function cancelEditMode() {
  editMode = false;
  document.getElementById('deleteSelectedBtn').style.display = 'none';
  document.getElementById('editModeBtn').style.display = 'inline-block';
  document.getElementById('cancelEditBtn').style.display = 'none';
  renderEvents(allEvents);
 
}




function updateDeleteBtnState() {
  const checkboxes = document.querySelectorAll('.edit-checkbox');
  const selected = Array.from(checkboxes).some(cb => cb.checked);
  document.getElementById('deleteSelectedBtn').disabled = !selected;
}



function toggleSelect(id, checked) {
  if (checked) {
    selectedEventIds.add(id);
  } else {
    selectedEventIds.delete(id);
  }
}

function deleteSelectedEvents() {
  if (selectedEventIds.size === 0) {
    alert("No events selected.");
    return;
  }

  if (!confirm("Are you sure you want to delete selected events?")) return;

  selectedEventIds.forEach(id => {
    fetch(`/api/events/${id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
    })
    .catch(err => console.error("Error deleting:", err));
  });

  // Reload events after short delay
  setTimeout(() => location.reload(), 500);
}

function saveEdits() {
  const editedElements = document.querySelectorAll(".editable");

  const updates = {};

  editedElements.forEach(el => {
    const id = el.dataset.id;
    const field = el.dataset.field;
    const value = el.innerText.trim();

    if (!updates[id]) updates[id] = {};
    updates[id][field] = value;
  });

  for (let [id, data] of Object.entries(updates)) {
    fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
    })
    .catch(err => console.error("Update error:", err));
  }

  setTimeout(() => location.reload(), 500);
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

// Sample fetch call – modify based on your actual API
fetch("/api/events/past")
  .then(res => res.json())
  .then(data => {
    allEvents = data;
    renderEvents(allEvents);
  })
  .catch(err => console.error("Error fetching events:", err));
