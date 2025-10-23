document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("eventForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const isoStart = `${date}T${time}`; // example: "2025-06-30T15:41"

    const eventData = {
      title: document.getElementById("eventName").value, // used by FullCalendar
      name: document.getElementById("eventName").value,
      date: date,
      time: time,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      start: isoStart,
      end: isoStart // or calculate end time if needed
    };


    fetch("http://localhost:8083/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Server error");
        }
        return response.json();
      })
      .then(data => {
        alert("Event submitted successfully!");
        form.reset();  // clear form
        console.log("Saved event:", data);
      })
      .catch(error => {
        console.error("Submit error:", error);
        alert("Error has occurred while submitting the form.");
      });
  });
});


$(document).ready(function () {
  // Initialize date picker
  $('#eventDate').pickadate({
    format: 'yyyy-mm-dd', // format for SQL compatibility
    selectMonths: true,
    selectYears: true,
    min: true // disallow past dates
  });

  // Initialize time picker
  $('#eventTime').pickatime({
    format: 'HH:i', // 24-hour format
    interval: 15
  });
});