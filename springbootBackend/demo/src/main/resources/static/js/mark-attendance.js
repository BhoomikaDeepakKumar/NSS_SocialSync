
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdFromQR = urlParams.get("eventId");

    fetch("http://localhost:8083/api/events/upcoming")
        .then(res => res.json())
        .then(events => {
            const select = document.getElementById("eventId");

            events.forEach(event => {
                const option = document.createElement("option");
                option.value = event.id;
                option.textContent = `${event.title} (${event.start.split("T")[0]})`;
                select.appendChild(option);
            });

            // If eventId came from QR code link, pre-select and pre-fill
            if (eventIdFromQR) {
                select.value = eventIdFromQR;
                const selectedEvent = events.find(ev => ev.id == eventIdFromQR);
                if (selectedEvent) {
                    document.getElementById("eventName").value = selectedEvent.title;
                    document.getElementById("eventDate").value = selectedEvent.start.split('T')[0];
                }
            }

            // Also update on dropdown change
            select.addEventListener("change", (e) => {
                const selected = events.find(ev => ev.id == e.target.value);
                if (selected) {
                    document.getElementById("eventName").value = selected.title;
                    document.getElementById("eventDate").value = selected.start.split('T')[0];
                }
            });
        });
});


function generateQRCode() {
    const eventId = document.getElementById("eventId").value;
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = ""; // Clear previous QR
    new QRCode(qrDiv, `http://localhost:8083/api/attendance/scan?eventId=${eventId}`);
}

document.getElementById("attendanceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const studentName = document.getElementById("studentName").value;
    const eventId = document.getElementById("eventId").value;

    // ✅ Moved validation inside the listener
    if (!studentId || !studentName) {
        alert("Please fill in both Student ID and Student Name.");
        return;
    }

    fetch("http://localhost:8083/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, studentName, eventId })
    })
        .then(res => res.ok ? alert("Attendance marked!") : alert("Error marking attendance."))
        .catch(err => alert("Failed: " + err));
});
