
if (typeof pendingUpdate === "undefined") {
    var pendingUpdate = false;
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

    // Logout functionality
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
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




function initializeResponsiveMenu() {
    // Add mobile menu toggle functionality
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    // ✅ Defensive check
    if (!sidebar || !content) {
        console.warn("Sidebar or content element not found.");
        return;
    }

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
          background: #B7C3F3;
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

    menuButton.addEventListener('click', function () {
        const isOpen = sidebar.style.transform === 'translateX(0px)';
        sidebar.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
        sidebar.style.transition = 'transform 0.3s ease';
    });

    window.addEventListener('resize', checkMobile);
    checkMobile();
}


document.addEventListener('DOMContentLoaded', () => {
    fetch('/components/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById("header-container").innerHTML = html;
            requestAnimationFrame(() => {
                fetchAndDisplayUserProfile();
            });
        });

    // Load Sidebar
    fetch("/components/sidebar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("sidebar-container").innerHTML = html;
            initializeResponsiveMenu();
              // Set active nav item *after* sidebar is injected
        const currentPath = window.location.pathname;
        const normalizedPath = currentPath.endsWith('/') && currentPath.length > 1
            ? currentPath.slice(0, -1)
            : currentPath;

        const navLinks = document.querySelectorAll('a.nav-item');
        navLinks.forEach(link => {
            let linkPath = link.getAttribute('href');
            if (linkPath.endsWith('/') && linkPath.length > 1) {
                linkPath = linkPath.slice(0, -1);
            }
            if (linkPath === normalizedPath) {
                link.classList.add('active');
            }
        });
        });

    // Load Footer
    // fetch("/components/footer.html")
    //     .then(res => res.text())
    //     .then(html => {
    //         document.getElementById("footer-container").innerHTML = html;
    //     });

    // Set 'active' nav item based on current path
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-item").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
    // });



    function fetchAndDisplayUserProfile() {
        fetch('/api/user/profile')
            .then(response => {
                if (!response.ok) throw new Error('User not found');
                return response.json();
            })
            .then(user => {
                const username = user.username || 'User';
                const usernameEl = document.getElementById('username');
                const avatarEl = document.getElementById('user-avatar');

                if (usernameEl && avatarEl) {
                    usernameEl.textContent = username;
                    avatarEl.textContent = username.charAt(0).toUpperCase();
                } else {
                    console.warn("Username or avatar element not found in header.");
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
});

