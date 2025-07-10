

let attendanceData = [];
let currentPage = 0;
const rowsPerPage = 10;
let isEditMode = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchAttendanceData();
  fetchAndPopulateEventDropdown();

  document.getElementById("searchInput").addEventListener("input", () => fetchAttendanceData(0));
  document.getElementById("dateFilter").addEventListener("change", handleDateChange);
  document.getElementById("eventFilter").addEventListener("change", () => fetchAttendanceData(0));
  document.getElementById("bulkDateFilter").addEventListener("change", handleBulkDateChange);
  document.getElementById("bulkEventFilter").addEventListener("change", () => fetchAttendanceData(0));

   const downloadBtn = document.getElementById("downloadTemplateBtn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", fetchEventsAndDownloadTemplate);
  }

    // Attach event listeners here
  const bulkDropdown = document.getElementById("bulkEventFilter");
  if (bulkDropdown) {
    bulkDropdown.addEventListener("change", () => {
      const selectedName = bulkDropdown.value;
      const selectedId = eventsMap[selectedName];
      console.log("Selected Event ID:", selectedId);
    });
  }
  });


function fetchAttendanceData(page = 0) {
  showLoading(true);

  const search = document.getElementById("searchInput").value;
  const date = document.getElementById("dateFilter").value;
  const eventId = document.getElementById("eventFilter").value;

  let url = `http://localhost:8083/api/attendance/records?page=${page}&size=${rowsPerPage}`;
  if (search) url += `&search=${search}`;
  if (date) url += `&date=${date}`;
  if (eventId) url += `&eventId=${eventId}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      attendanceData = data.content;
      currentPage = data.number;
      populateEventFilter(data.content);
      renderAttendanceRows(); 
      updatePaginationInfo(data.totalPages);
    })
    .catch(err => console.error("Fetch error:", err))
    .finally(() => showLoading(false)); // ✅ correct here
}


function populateEventFilter(data) {
  const eventFilter = document.getElementById("eventFilter");
  const currentOptions = Array.from(eventFilter.options).map(opt => opt.value);
  
  const uniqueEvents = new Set(data.map(item => `${item.eventId}-${item.eventName}`));

  uniqueEvents.forEach(eventKey => {
    const [id, name] = eventKey.split("-");
    if (!currentOptions.includes(id)) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = name;
      eventFilter.appendChild(opt);
    }
  });
}



function renderAttendanceRows() {
  const tableBody = document.querySelector("#attendanceTable tbody");
  tableBody.innerHTML = "";

  attendanceData.forEach(record => {
    const row = document.createElement("tr");

    if (isEditMode) {
      const checkboxCell = document.createElement("td");
      checkboxCell.classList.add("edit-checkbox-column");
      checkboxCell.innerHTML = `<input type="checkbox" class="rowCheckbox" data-id="${record.id}">`;
      row.appendChild(checkboxCell);
    } else {
      const checkboxCell = document.createElement("td");
      checkboxCell.classList.add("edit-checkbox-column");
      checkboxCell.style.display = "none";
      checkboxCell.innerHTML = `<input type="checkbox" class="rowCheckbox" data-id="${record.id}">`;
      row.appendChild(checkboxCell);
    }

    row.innerHTML += `
      <td>${record.studentName}</td>
      <td>${record.studentId}</td>
      <td>${record.eventName}</td>
      <td>${record.date}</td>
      <td><span class="badge bg-success">Present</span></td>
    `;

    tableBody.appendChild(row);
  });
}


//Check all box
function toggleSelectAll(source) {
  const checkboxes = document.querySelectorAll(".rowCheckbox");
  checkboxes.forEach(cb => cb.checked = source.checked);
}

//Delete Records
function deleteSelectedRecords() {
  const selectedIds = [...document.querySelectorAll(".rowCheckbox:checked")].map(cb =>
    parseInt(cb.getAttribute("data-id"))
  );

  if (selectedIds.length === 0) {
    alert("Please select at least one record to delete.");
    return;
  }

  if (!confirm("Are you sure you want to delete the selected records?")) return;

  fetch("http://localhost:8083/api/attendance/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selectedIds)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete records");
      return res.text();
    })
    .then(msg => {
      alert("Selected records deleted successfully!");
      fetchAttendanceData(currentPage); // refresh current page
    })
    .catch(err => {
      console.error("Delete error:", err);
      alert("Failed to delete selected records.");
    });
}




function updatePaginationInfo(totalPages) {
  document.getElementById("paginationInfo").textContent = `Page ${currentPage + 1} of ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 0;
  document.getElementById("nextBtn").disabled = currentPage + 1 >= totalPages;
}

function nextPage() {
  fetchAttendanceData(currentPage + 1);
}

function prevPage() {
  if (currentPage > 0) fetchAttendanceData(currentPage - 1);
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("dateFilter").value = "";
  document.getElementById("eventFilter").selectedIndex = 0;
  fetchAttendanceData(0); // Go back to page 1
}


// function exportCSV() {
//   let csv = "Student Name,Student ID,Event Name,Date,Status\n";
//   attendanceData.forEach(record => {
//     // Wrap each field in double quotes to prevent Excel formatting issues
//     const row = `"${record.studentName}","${record.studentId}","${record.eventName}","${record.date}","Present"\n`;
//     csv += row;
//   });

//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "attendance_records.csv";
//   a.click();
//   URL.revokeObjectURL(url);
// }

async function exportCSV() {
  const allFilteredData = await fetchAllFilteredAttendanceData();

  if (allFilteredData.length === 0) {
    alert("No records to export.");
    return;
  }

  let csv = "Student Name,Student ID,Event Name,Date,Status\n";
  allFilteredData.forEach(record => {
    const row = `"${record.studentName}","${record.studentId}","${record.eventName}","${record.date}","Present"\n`;
    csv += row;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_records.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// function exportPDF() {
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF();

//   const headers = [["Student Name", "Student ID", "Event Name", "Date", "Status"]];

//   const rows = attendanceData.map(record => [
//     record.studentName,
//     record.studentId,
//     record.eventName,
//     record.date,
//     "Present"
//   ]);

//   doc.text("Attendance Records", 14, 15);
//   doc.autoTable({
//     startY: 20,
//     head: headers,
//     body: rows,
//     styles: { fontSize: 10 },
//     theme: "striped",
//     headStyles: { fillColor: [75, 192, 192] }
//   });

//   doc.save("attendance_records.pdf");
// }

async function exportPDF() {
  const allFilteredData = await fetchAllFilteredAttendanceData();

  if (allFilteredData.length === 0) {
    alert("No records to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const headers = [["Student Name", "Student ID", "Event Name", "Date", "Status"]];
  const rows = allFilteredData.map(record => [
    record.studentName,
    record.studentId,
    record.eventName,
    record.date,
    "Present"
  ]);

  doc.text("Attendance Records", 14, 15);
  doc.autoTable({
    startY: 20,
    head: headers,
    body: rows,
    styles: { fontSize: 10 },
    theme: "striped",
    headStyles: { fillColor: [75, 192, 192] }
  });

  doc.save("attendance_records.pdf");
}


function handleBulkUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const errors = [];

    const validatedRows = rows.map((row, index) => {
      const studentName = row["Student Name"];
      const studentId = row["Roll Number"];
      const eventId = row["Event Id"];
      const eventName = row["Event Name"];
      const date = row["Date (YYYY-MM-DD)"];

      if (!studentName || !studentId || !eventId || !eventName || !date) {
        errors.push(`Row ${index + 2}: Missing required fields.`);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push(`Row ${index + 2}: Invalid date format (yyyy-mm-dd required).`);
      }

      return {
        studentName,
        studentId,
        eventId,
        eventName,
        date,
        status: "Present"
      };
    });

    if (errors.length > 0) {
      alert("Errors found:\n" + errors.join("\n"));
      return;
    }

    // ✅ Now send validatedRows to backend
    console.log("Valid data:", validatedRows);

    fetch("http://localhost:8083/api/attendance/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(validatedRows)
    })
    .then(response => {
      if (!response.ok) throw new Error("Upload failed");
      return response.text(); // assuming backend returns plain string
    })
    .then(msg => {
      alert("Upload successful!");
      fetchAttendanceData(); // Refresh table if needed
    })
    .catch(err => {
      console.error("Upload error:", err);
      alert("There was an error uploading attendance.");
    });
  };

  reader.readAsArrayBuffer(file);
}





function showLoading(show) {
  document.getElementById("loadingSpinner").style.display = show ? "block" : "none";
}


//auto event id fetch
let eventsMap = {}; // { "Tree Plantation Drive": 101, "Blood Donation": 102 }

function populateEventDropdown(events) {
  const dropdown = document.getElementById("bulkEventFilter");
  dropdown.innerHTML = `<option value="">Select Event</option>`;
  events.forEach(event => {
    eventsMap[event.eventName] = event.eventId;
    dropdown.innerHTML += `<option value="${event.eventName}">${event.eventName}</option>`;
  });
}

//Make this fetch data from event date and then name
async function fetchAndPopulateEventDropdown() {
  try {
    const res = await fetch("http://localhost:8083/api/events");
    const events = await res.json();

    populateEventDropdown(events); // Fills dropdown
  } catch (err) {
    console.error("Failed to fetch events:", err);
  }
}


// document.getElementById("bulkEventFilter").addEventListener("change", function () {
//   const selectedName = this.value;
//   const selectedId = eventsMap[selectedName];
//   document.getElementById("eventIdDisplay").value = selectedId || "";
// });



async function handleDateChange() {
  const selectedDate = document.getElementById("dateFilter").value;
  const eventDropdown = document.getElementById("eventFilter");

  if (!selectedDate) return;

  try {
    const response = await fetch(`http://localhost:8083/api/events/by-date?date=${selectedDate}`);
    const events = await response.json();

    eventDropdown.innerHTML = `<option value="">Select Event (after date)</option>`;

    if (events.length === 0) {
      const option = document.createElement("option");
      option.text = "No events found";
      option.disabled = true;
      eventDropdown.appendChild(option);
      return;
    }

    events.forEach(event => {
      const option = document.createElement("option");
      option.value = event.id;
      option.text = `${event.name} (${event.date})`;
      eventDropdown.appendChild(option);
    });

  } catch (err) {
    console.error("Error fetching events:", err);
    eventDropdown.innerHTML = `<option value="">Error loading events</option>`;
  }
}


async function handleBulkDateChange() {
  const selectedDate = document.getElementById("bulkDateFilter").value;
  const eventDropdown = document.getElementById("bulkEventFilter");

  if (!selectedDate) return;

  try {
    const response = await fetch(`http://localhost:8083/api/events/by-date?date=${selectedDate}`);
    const events = await response.json();

    eventDropdown.innerHTML = `<option value="">Select Event (after date)</option>`;

    if (events.length === 0) {
      const option = document.createElement("option");
      option.text = "No events found";
      option.disabled = true;
      eventDropdown.appendChild(option);
      return;
    }

    events.forEach(event => {
      const option = document.createElement("option");
      option.value = event.id;
      option.text = `${event.name} (${event.date})`;
      eventDropdown.appendChild(option);
    });

  } catch (err) {
    console.error("Error fetching events:", err);
    eventDropdown.innerHTML = `<option value="">Error loading events</option>`;
  }
}


//Download Template 
//Excel event name and id
async function fetchEventsAndDownloadTemplate() {
  console.log("Download button clicked"); // 🔍 Add this to confirm click works
  const eventDropdown = document.getElementById("bulkEventFilter");
  const selectedEventName = eventDropdown.value;



  const selectedEventDate = new Date(document.getElementById("bulkDateFilter").value)
    .toISOString()
    .split('T')[0];

//     console.log("Selected Event Name:", selectedEventName);
// console.log("Selected Event Date:", selectedEventDate);

  if (!selectedEventName) {
    alert("Please select an event before downloading the template.");
    return;
  }
  // Fetch the list of events
  const response = await fetch("http://localhost:8083/api/events");
  const events = await response.json();

  // Find event using BOTH name and date
const selectedEventId = parseInt(eventDropdown.value); // it's a string, so parse it
const selectedEvent = events.find(e => 
  e.id === selectedEventId && e.date === selectedEventDate
);

// console.log("Selected Event ID:", selectedEventId);
// console.log("Matching Event:", selectedEvent);

  if (!selectedEvent) {
    alert("Selected event not found.");
    return;
  }

  const wb = XLSX.utils.book_new();

  const wsData = [
    ["Student Name", "Roll Number", "Event Id", "Event Name", "Date (YYYY-MM-DD)"],
    ["", "", selectedEvent.id, selectedEvent.eventName, selectedEvent.date]
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Format date column
  ws["E2"].z = "yyyy-mm-dd";

  // Add dropdown for status
  ws["!dataValidation"] = [{
    type: "list",
    allowBlank: false,
    sqref: "F2:F100",
    formulas: ['"Present,Absent"']
  }];

  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, `Attendance_Template_${selectedEvent.eventName}.xlsx`);
}

// Called on Edit button click
function toggleEditMode() {
  isEditMode = true;
  document.querySelectorAll('.edit-checkbox-column').forEach(el => el.style.display = '');

  document.getElementById('deleteSelectedBtn').style.display = 'inline-block';
  document.getElementById('cancelEditBtn').style.display = 'inline-block';
  document.getElementById('editModeBtn').style.display = 'none';

  renderAttendanceRows(); // show checkboxes
}

function cancelEditMode() {
  isEditMode = false;
  document.querySelectorAll('.edit-checkbox-column').forEach(el => el.style.display = 'none');
  document.getElementById('deleteSelectedBtn').style.display = 'none';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.getElementById('editModeBtn').style.display = 'inline-block';

  renderAttendanceRows(); // hide checkboxes
}




//export all pages
async function fetchAllFilteredAttendanceData() {
  const search = document.getElementById("searchInput").value;
  const date = document.getElementById("dateFilter").value;
  const eventId = document.getElementById("eventFilter").value;

  let url = `http://localhost:8083/api/attendance/records?page=0&size=100000`; // fetch all matching

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (date) url += `&date=${encodeURIComponent(date)}`;
  if (eventId) url += `&eventId=${encodeURIComponent(eventId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result.content || [];
  } catch (error) {
    console.error("Failed to fetch all filtered data:", error);
    alert("Error fetching records for export.");
    return [];
  }
}
