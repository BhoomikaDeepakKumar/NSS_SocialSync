if (typeof pendingUpdate === "undefined") {
    var pendingUpdate = false;
}

// Function to update data bindings and loops
function update() {
    if (pendingUpdate === true) return;
    pendingUpdate = true;

    updateNavigationInteractions();

    pendingUpdate = false;
}

function updateNavigationInteractions() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            const navText = this.querySelector('.nav-text').textContent;
            updatePageContent(navText);
        });
    });

    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully!');
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

    const content = document.querySelector('.content');
    if (content) {
        content.style.opacity = '0.5';
        setTimeout(() => content.style.opacity = '1', 300);
    }
}

// Initialize app
function initialize() {
    update();

    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    window.addEventListener('load', () => document.body.style.opacity = '1');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Export functions
window.AdminPanel = { update, updatePageContent };

// Responsive menu
function initializeResponsiveMenu() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    if (!sidebar || !content) return;

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

    function checkMobile() {
        if (window.innerWidth <= 991) menuButton.style.display = 'block';
        else {
            menuButton.style.display = 'none';
            sidebar.style.transform = '';
        }
    }

    menuButton.addEventListener('click', () => {
        const isOpen = sidebar.style.transform === 'translateX(0px)';
        sidebar.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
        sidebar.style.transition = 'transform 0.3s ease';
        if (isOpen) content.classList.add('expanded');
        else content.classList.remove('expanded');
    });

    window.addEventListener('resize', checkMobile);
    checkMobile();
}

// Load header, sidebar, and initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {

    // Load Header
    fetch('/components/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById("header-container").innerHTML = html;

            // Now header exists → attach dropdown
            const profileIcon = document.getElementById('profileIcon');
            const profileDropdown = document.getElementById('profileDropdown');
            const logoutBtn = document.getElementById('logoutBtn');

            if (profileIcon && profileDropdown) {
                profileIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
                });

                document.addEventListener('click', (e) => {
                    if (!profileDropdown.contains(e.target) && !profileIcon.contains(e.target)) {
                        profileDropdown.style.display = 'none';
                    }
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    alert('Logging out...');
                });
            }

            // Fetch and display user profile
            fetch('/api/user/profile')
                .then(resp => {
                    if (!resp.ok) throw new Error('User not found');
                    return resp.json();
                })
                .then(user => {
                    const username = user.username || 'User';
                    const usernameEl = document.getElementById('username');
                    const avatarEl = document.getElementById('user-avatar');

                    if (usernameEl) usernameEl.textContent = username;
                    if (avatarEl) avatarEl.textContent = username.charAt(0).toUpperCase();
                })
                .catch(err => console.error(err));
        });

    // Load Sidebar
    fetch("/components/sidebar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("sidebar-container").innerHTML = html;
            initializeResponsiveMenu();

            // Set active nav item
            const currentPath = window.location.pathname.replace(/\/$/, "");
            document.querySelectorAll('a.nav-item').forEach(link => {
                const linkPath = link.getAttribute('href').replace(/\/$/, "");
                if (linkPath === currentPath) link.classList.add('active');
            });
        });

});
