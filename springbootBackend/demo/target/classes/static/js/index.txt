
  let pendingUpdate = false;


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


      pendingUpdate = false;
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
      updatePageContent
  };


