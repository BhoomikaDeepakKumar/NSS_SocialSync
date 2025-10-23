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

            const handleSelectChange = (e) => {
                const selected = events.find(ev => ev.id == e.target.value);
                if (selected) {
                    document.getElementById("eventName").value = selected.title;
                    document.getElementById("eventDate").value = selected.start.split('T')[0];
                }
            };

            // Attach the event listener
            select.addEventListener("change", handleSelectChange);

            if (eventIdFromQR) {
                // Pre-fill if QR code is used
                select.value = eventIdFromQR;
                handleSelectChange({ target: select });
            } else if (select.options.length > 0) {
                // Pre-fill the first option manually
                select.selectedIndex = 0;
                handleSelectChange({ target: select });
            }
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
.then(res => {
    if (res.status === 409) {
        alert("You’ve already marked attendance for this event.");
    } else if (res.ok) {
        alert("Attendance marked!");
    } else {
        alert("Error marking attendance.");
    }
})
.catch(err => alert("Failed: " + err));

});
