let allStudents = [];

document.addEventListener("DOMContentLoaded", () => {
 const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
// Set default values
  document.getElementById("lineChartMonth").value = currentMonth;
  document.getElementById("heatmapMonth").value = currentMonth;



  fetchStudentNames();
  loadLeaderboard();
   drawMonthlyLineChart(); // draw with current month
  drawHeatmap();          // draw with current month

  document.getElementById("lineChartMonth").addEventListener("change", drawMonthlyLineChart);
  document.getElementById("heatmapMonth").addEventListener("change", drawHeatmap);
  document.getElementById("searchBtn").addEventListener("click", () => {
    const input = document.getElementById("searchInput").value.trim().toLowerCase();
    const student = allStudents.find(s =>
      s.studentId.toLowerCase() === input || s.studentName.toLowerCase() === input
    );

    if (student) {
      fetchStudentPieChart(student.studentId);
    } else {
      const message = document.getElementById("pieChartMessage");
      const canvas = document.getElementById("studentAttendancePieChart");
      if (pieChartInstance) pieChartInstance.destroy();
      canvas.style.display = "none";
      message.textContent = "Student not found. Please enter a valid ID or name.";
    }
  });
});



async function fetchData(url) {
  try {
    const res = await fetch(`http://localhost:8083${url}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// 1. LEADERBOARD
async function loadLeaderboard() {
  const data = await fetchData("/api/reports/leaderboard");
  const sorted = data.sort((a, b) => b.eventsAttended - a.eventsAttended).slice(0, 10);
  const tbody = document.getElementById("leaderboardTableBody");
  tbody.innerHTML = "";
  sorted.forEach((student, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${student.studentName}</td>
        <td>${student.studentId}</td>
        <td>${student.eventsAttended}</td>
      </tr>
    `;
  });
}



// 2. STUDENT PIE CHART
let pieChartInstance;

// Fetch all student names on page load
async function fetchStudentNames() {
  try {
    const response = await fetch('http://localhost:8083/api/reports/students');
    allStudents = await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Draw pie chart
async function fetchStudentPieChart(studentIdFromClick = null) {
  const input = studentIdFromClick || document.getElementById("searchInput").value.trim();
  const canvas = document.getElementById("studentAttendancePieChart");
  const message = document.getElementById("pieChartMessage");

  let student = allStudents.find(s =>
    s.studentId.toLowerCase() === input.toLowerCase() ||
    s.studentName.toLowerCase() === input.toLowerCase()
  );

  if (!student) {
    message.textContent = "Student not found. Please select a valid name or ID.";
    canvas.style.display = "none";
    if (pieChartInstance) pieChartInstance.destroy();
    return;
  }

  const studentId = student.studentId;
  const start = "2024-07-01";
  const end = "2025-06-30";

  try {
    const res = await fetch(`http://localhost:8083/api/reports/student/${studentId}?start=${start}&end=${end}`);
    const data = await res.json();

    const { studentName, presentCount, absentCount } = data;
    const totalEvents = presentCount + absentCount;

    if (totalEvents === 0) {
      if (pieChartInstance) pieChartInstance.destroy();
      canvas.style.display = "none";
      message.textContent = `No attendance data found for ${studentName}`;
      return;
    }

    canvas.style.display = "block";
    message.textContent = "";

    const ctx = canvas.getContext('2d');
    if (pieChartInstance) pieChartInstance.destroy();

    pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [presentCount, absentCount],
          backgroundColor: ['#23B5D3', '#A2AEBB'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Attendance Summary for ${studentName} (ID: ${studentId})`
          }
        }
      }
    });

  } catch (err) {
    console.error("Error fetching pie chart:", err);
    message.textContent = "Error fetching data. Please try again.";
    canvas.style.display = "none";
  }
}



// 3. MONTHLY LINE CHART
let lineChartInstance;

async function drawMonthlyLineChart() {
  const month = document.getElementById("lineChartMonth").value;
  const ctx = document.getElementById("monthlyAttendanceLineChart").getContext("2d");
  const message = document.getElementById("lineChartMessage");

  if (lineChartInstance) lineChartInstance.destroy();
  message.textContent = "";

  if (!month) return;

  const data = await fetchData(`/api/reports/monthly-summary?month=${month}`);
  if (data.length === 0) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    message.textContent = "No data available for this month.";
    return;
  }

  lineChartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels: data.map(e => e.eventName),
    datasets: [{
      label: "Number of Attendees",
      data: data.map(e => e.attendeeCount),
      fill: false,
      borderColor: "#7353BA", // Line color
      tension: 0.3
    }]
  },
  options: {
    scales: {
      x: {
        grid: {
          display: false // Hides X-axis grid lines
        }
      },
      y: {
        grid: {
          display: false // Hides Y-axis grid lines
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#333" // Optional: darken legend text
        }
      }
    }
  }
});
}

// 4. HEATMAP
async function drawHeatmap() {
  const month = document.getElementById("heatmapMonth").value;
  const container = document.getElementById("attendanceHeatmap");
  container.innerHTML = "";

  if (!month) return;

  const data = await fetchData(`/api/reports/daily?month=${month}`);
  const year = month.split("-")[0];
  const monthIndex = parseInt(month.split("-")[1]) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const heatmap = document.createElement("div");
  heatmap.style.display = "grid";
  heatmap.style.gridTemplateColumns = "repeat(7, 1fr)";
  heatmap.style.gap = "5px";

  const maxCount = Math.max(...data.map(d => d.attendeeCount)); // for color scaling

  const getColor = (value) => {
    if (maxCount === 0) return "#eeeeee";
    const intensity = value / maxCount;
    const r = 255 - Math.round(155 * intensity);
    const g = 100 + Math.round(155 * intensity);
    const b = 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const attendance = data.find(d => parseInt(d.date.split("-")[2]) === day);
    const count = attendance ? attendance.attendeeCount : 0;
    const color = getColor(count);

    const cell = document.createElement("div");
    cell.style.width = "40px";
    cell.style.height = "40px";
    cell.style.backgroundColor = color;
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.color = "white";
    cell.style.borderRadius = "6px";
    cell.innerText = day;

    // Tooltip
    cell.title = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}: ${count} attendee${count === 1 ? '' : 's'}`;

    heatmap.appendChild(cell);
  }

  container.appendChild(heatmap);
}
