// Handle Upload Form Submit
document.getElementById("uploadReportForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch("/api/reports/upload", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert("Report uploaded successfully!");
      addReportToTable(result); // add saved report row
      this.reset();
    } else {
      alert(result.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});

// Add a single report row to the table
function addReportToTable(report) {
  const tableBody = document.getElementById("reportsTableBody");

  const row = document.createElement("tr");
  row.setAttribute("data-id", report.id); // store id for future actions

  row.innerHTML = `
    <td>${report.eventName}</td>
    <td>${report.fileName}</td>
    <td>${new Date(report.uploadTime).toLocaleString()}</td>
    <td>
      <a href="/uploads/reports/${report.fileName}" target="_blank" class="btn btn-primary btn-sm">Download</a>
    </td>
  `;

  tableBody.appendChild(row);
}

// Load all reports from backend on page load
async function loadReports() {
  try {
    const response = await fetch("/api/reports/all");
    if (response.ok) {
      const reports = await response.json();
      reports.forEach(addReportToTable);
    } else {
      console.error("Failed to load reports");
    }
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
}

// Load reports when DOM is ready
document.addEventListener("DOMContentLoaded", loadReports);
