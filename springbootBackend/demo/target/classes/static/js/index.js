(() => {
  const state = {
      currentDate: new Date(),
      selectedDate: null,
      events: {
          '2022-09-08': { type: 'completed', title: 'Team Meeting' },
          '2022-09-17': { type: 'ongoing', title: 'Project Review' },
          '2022-09-29': { type: 'upcoming', title: 'Conference' }
      }
  };

  let context = null;
  let nodesToDestroy = [];
  let pendingUpdate = false;

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

      // Update calendar interactions
      updateCalendarInteractions();

      // Update navigation interactions
      updateNavigationInteractions();

      // Update stats animations
      updateStatsAnimations();

      destroyAnyNodes();
      pendingUpdate = false;
  }

  function updateCalendarInteractions() {
      const calendarDays = document.querySelectorAll('.calendar-day');

      calendarDays.forEach(day => {
          day.addEventListener('click', function() {
              // Remove previous selection
              document.querySelectorAll('.calendar-day.selected').forEach(selected => {
                  selected.classList.remove('selected');
              });

              // Add selection to clicked day
              this.classList.add('selected');
              state.selectedDate = this.textContent;

              // Show event details if exists
              showEventDetails(this.textContent);
          });

          day.addEventListener('mouseenter', function() {
              if (!this.classList.contains('prev-month') && !this.classList.contains('next-month')) {
                  this.style.backgroundColor = 'rgba(47, 137, 125, 0.1)';
              }
          });

          day.addEventListener('mouseleave', function() {
              if (!this.classList.contains('selected')) {
                  this.style.backgroundColor = '';
              }
          });
      });
  }

  function updateNavigationInteractions() {
      const navItems = document.querySelectorAll('.nav-item');

      navItems.forEach(item => {
          item.addEventListener('click', function() {
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

      // Logout functionality
      const logoutButton = document.querySelector('.logout-button');
      if (logoutButton) {
          logoutButton.addEventListener('click', function() {
              if (confirm('Are you sure you want to logout?')) {
                  // Simulate logout
                  alert('Logged out successfully!');
                  // In a real application, you would redirect to login page
              }
          });
      }
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

  

  function initializeResponsiveMenu() {
      // Add mobile menu toggle functionality
      const sidebar = document.querySelector('.sidebar');
      const content = document.querySelector('.content');

      // Create mobile menu button
      const menuButton = document.createElement('button');
      menuButton.className = 'mobile-menu-toggle';
      menuButton.innerHTML = '☰';
      menuButton.style.cssText = `
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: rgba(47, 137, 125, 1);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          font-size: 18px;
          cursor: pointer;
      `;

      document.body.appendChild(menuButton);

      // Show menu button on mobile
      function checkMobile() {
          if (window.innerWidth <= 991) {
              menuButton.style.display = 'block';
          } else {
              menuButton.style.display = 'none';
              sidebar.style.transform = '';
          }
      }

      menuButton.addEventListener('click', function() {
          const isOpen = sidebar.style.transform === 'translateX(0px)';
          sidebar.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
          sidebar.style.transition = 'transform 0.3s ease';
      });

      window.addEventListener('resize', checkMobile);
      checkMobile();
  }


  // Initialize all functionality
  function initialize() {
      update();
      initializeResponsiveMenu();

      // Add smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';

      // Add loading animation
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.5s ease';

      window.addEventListener('load', function() {
          document.body.style.opacity = '1';
      });
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
})();


 document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('eventCalendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
        events: [
             {
    title: 'Ongoing Event',
    start: '2025-06-17',
    className: 'event-ongoing'
  },
  {
    title: 'Completed Event',
    start: '2025-06-10',
    className: 'event-completed'
  },
  {
    title: 'Upcoming Event',
    start: '2025-06-20',
    className: 'event-upcoming'
  }
        ],
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    events: [
      {
        title: 'Upcoming Event',
        start: '2025-06-22',
        color: '#28a745'
      },
      {
        title: 'Ongoing Event',
        start: '2025-06-16',
        end: '2025-06-18',
        color: '#ffc107'
      },
      {
        title: 'Completed Event',
        start: '2025-06-10',
        end: '2025-06-12',
        color: '#6c757d'
      }
    ]
  });

  calendar.render();
});



// Global chart instance variable
    let attendanceChartInstance;

    const attendanceData = [
        { month: 'Jan', present_days: 18 },
        { month: 'Feb', present_days: 20 },
        { month: 'Mar', present_days: 22 },
        { month: 'Apr', present_days: 17 },
        { month: 'May', present_days: 25 },
        { month: 'Jun', present_days: 19 }
    ];

    const labels = attendanceData.map(entry => entry.month);
    const data = attendanceData.map(entry => entry.present_days);

    const ctx = document.getElementById('attendanceChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "rgba(74, 144, 226, 0.4)");
gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Attendance",
      data: [85, 90, 87, 93, 95, 92],
      fill: true,
      backgroundColor: gradient,
      borderColor: "#4A90E2",
      tension: 0.4,
      pointBackgroundColor: "#4A90E2",
      pointBorderColor: "#fff",
      pointHoverRadius: 6,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: {
        ticks: {
          color: "#444",
          font: { family: "Poppins", size: 14 }
        },
        grid: {
          color: "rgba(0,0,0,0.05)"
        }
      },
      y: {
        ticks: {
          color: "#444",
          font: { family: "Poppins", size: 14 }
        },
        grid: {
          color: "rgba(0,0,0,0.05)"
        }
      }
    }
  }
});

    // Destroy existing chart instance if it exists
    if (attendanceChartInstance) {
        attendanceChartInstance.destroy();
    }

    attendanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Attendance',
                data: data,
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#fff',
                pointRadius: 5,
                borderWidth: 2

                
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Present Days'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    