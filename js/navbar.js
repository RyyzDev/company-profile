const circleBtn = document.getElementById('circleBtn');
const menuDropdown = document.getElementById('menuDropdown');
const hamburger = document.getElementById('hamburger');
const menuItems = document.querySelectorAll('.menu-item');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Safe guards: only attach listeners when elements exist
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
    });
}

if (circleBtn && menuDropdown && hamburger) {
    circleBtn.addEventListener('click', (e) => {
        // prevent click from bubbling to document
        e.stopPropagation();
        menuDropdown.classList.toggle('active');
        hamburger.classList.toggle('active');
        // update aria-hidden for accessibility
        const isActive = menuDropdown.classList.contains('active');
        menuDropdown.setAttribute('aria-hidden', String(!isActive));
    });

    // Close menu ketika klik menu item
    if (menuItems && menuItems.length) {
        menuItems.forEach((item) => {
            item.addEventListener('click', () => {
                menuDropdown.classList.remove('active');
                hamburger.classList.remove('active');
                menuDropdown.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // Close menu ketika klik di luar
    document.addEventListener('click', (e) => {
        if (!circleBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
            menuDropdown.classList.remove('active');
            hamburger.classList.remove('active');
            menuDropdown.setAttribute('aria-hidden', 'true');
        }
    });
}
