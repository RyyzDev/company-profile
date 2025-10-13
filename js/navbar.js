const circleBtn = document.getElementById('circleBtn');
        const menuDropdown = document.getElementById('menuDropdown');
        const hamburger = document.getElementById('hamburger');
        const menuItems = document.querySelectorAll('.menu-item');
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // Theme Toggle
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
        });

        circleBtn.addEventListener('click', () => {
            menuDropdown.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu ketika klik menu item
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuDropdown.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu ketika klik di luar
        document.addEventListener('click', (e) => {
            if (!circleBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });