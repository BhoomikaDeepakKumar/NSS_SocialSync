let state = {
    events: {} // Make sure this is filled via your API or manually for now
};

let nodesToDestroy = [];

function destroyAnyNodes() {
    // destroy current view template refs before rendering again
    nodesToDestroy.forEach((el) => el.remove());
    nodesToDestroy = [];
}

// Function to update data bindings and loops
// call update() when you mutate state and need the updates to reflect
// in the dom
function update() {
    if (pendingUpdate === true) {
        return;
    }
    pendingUpdate = true;

    // Update navigation interactions
    updateNavigationInteractions();

    // Update stats animations
    updateStatsAnimations();

    destroyAnyNodes();
    pendingUpdate = false;
}



function updateNavigationInteractions() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get the navigation text
            const navText = this.querySelector('.nav-text').textContent;

            // Update page content based on navigation
            updatePageContent(navText);
        });
    });
}

    function updateStatsAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number, .stat-number-large');

        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = finalValue / 50; // Animation duration

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue);
            }, 20);
        });
    }

    function showEventDetails(day) {
        const eventKey = `2022-09-${day.padStart(2, '0')}`;
        const event = state.events[eventKey];

        if (event) {
            const eventInfo = document.createElement('div');
            eventInfo.className = 'event-popup';
            eventInfo.innerHTML = `
              <div class="event-popup-content">
                  <h4>${event.title}</h4>
                  <p>Date: ${eventKey}</p>
                  <p>Status: ${event.type}</p>
                  <button onclick="this.parentElement.parentElement.remove()">Close</button>
              </div>
          `;

            // Add popup styles
            eventInfo.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              z-index: 1000;
          `;

            document.body.appendChild(eventInfo);

            // Auto remove after 3 seconds
            setTimeout(() => {
                if (eventInfo.parentElement) {
                    eventInfo.remove();
                }
            }, 3000);
        }
    }

    function updatePageContent(navText) {
        const pageTitle = document.querySelector('.page-title');
        const breadcrumb = document.querySelector('.current-page');

        if (pageTitle && breadcrumb) {
            pageTitle.textContent = navText.toUpperCase();
            breadcrumb.textContent = navText;
        }

        // Simulate content loading
        const content = document.querySelector('.content');
        content.style.opacity = '0.5';

        setTimeout(() => {
            content.style.opacity = '1';
        }, 300);
    }




    // Initialize all functionality
    function initialize() {
        update();

        // Add smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';

        // Add loading animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        window.addEventListener('load', function () {
            document.body.style.opacity = '1';
        });

        // FullCalendar setup
    const calendarEl = document.getElementById('eventCalendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            height: 'auto',
            events: '/api/events',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }
        });
        calendar.render();

        const observer = new MutationObserver(() => {
    const calendarTable = document.querySelector(".fc-scrollgrid-sync-table");
    if (calendarTable) {
        calendarTable.style.width = "100%";
    }
});

observer.observe(calendarEl, {
    childList: true,
    subtree: true
});

    }




    // Dashboard stats fetch
    fetch('http://localhost:8083/api/dashboard/stats')
        .then(res => res.json())
        .then(data => {
            document.getElementById("last-event-attendance").textContent = data.lastEventAttendance ?? 0;
            document.getElementById("average-attendance").textContent = data.averageAttendance ?? 0;
        })
        .catch(err => console.error('Error loading dashboard stats:', err));
}
    

    // Start the application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Export functions for external use
    window.AdminPanel = {
        update,
        state,
        showEventDetails,
        updatePageContent
    };

















    document.addEventListener("DOMContentLoaded", function () {
  // Attendance Chart
  new Chart(document.getElementById("attendanceSummaryChart"), {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: "Volunteers Attended",
        data: [50, 65, 70, 80, 95],
        backgroundColor: "#FEE9E1"
      }]
    }
  });

  // Performance Chart
  new Chart(document.getElementById("performanceChart"), {
    type: "bar",
    data: {
      labels: ["Participation", "Punctuality", "Task Completion"],
      datasets: [{
        label: "Actual",
        data: [75, 82, 68],
        backgroundColor: "#9c786d"
      }, {
        label: "Target",
        data: [90, 90, 90],
        backgroundColor: "#FEE9E1"
      }]
    }
  });

  // Engagement Pie Chart
  new Chart(document.getElementById("engagementPieChart"), {
    type: "pie",
    data: {
      labels: ["Social Media", "Word of Mouth", "College Drive"],
      datasets: [{
        data: [33.3, 33.3, 33.3],
        backgroundColor: ["#9c786d", "#F7BFA1", "#FEE9E1"]
      }]
    }
  });

  // Resource Chart
  new Chart(document.getElementById("resourceChart"), {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: "Resources Used (₹)",
        data: [2000, 3200, 2700, 4100, 5000],
        backgroundColor: "#F7BFA1"
      }]
    }
  });



  
});


let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  let nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

function prevSlide() {
  let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

function goToSlide(index) {
  showSlide(index);
}

// Scroll functions
function scrollToCanonEvents() {
  document.querySelector(".canon-events-section").scrollIntoView({ behavior: "smooth" });
}

function scrollToReports() {
  document.querySelector(".nss-progress-report").scrollIntoView({ behavior: "smooth" });
}

// Optional: auto-switch slides
// setInterval(nextSlide, 5000);
