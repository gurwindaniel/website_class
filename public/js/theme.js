// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Get current theme from body data attribute
    let currentTheme = body.getAttribute('data-theme') || 'light';

    // Update icon based on current theme
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️'; // Sun icon for switching to light
        } else {
            themeIcon.textContent = '🌙'; // Moon icon for switching to dark
        }
    }

    // Initialize icon on page load
    updateThemeIcon(currentTheme);

    // Toggle theme function
    async function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Update body class for immediate visual feedback
        body.classList.remove(currentTheme + '-theme');
        body.classList.add(newTheme + '-theme');
        body.setAttribute('data-theme', newTheme);

        // Update icon
        updateThemeIcon(newTheme);

        // Save theme to server via cookie
        try {
            const response = await fetch('/set-theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ theme: newTheme })
            });

            if (response.ok) {
                currentTheme = newTheme;
                console.log('Theme saved:', newTheme);
            } else {
                console.error('Failed to save theme');
            }
        } catch (error) {
            console.error('Error saving theme:', error);
            // Theme is already applied visually, just log the error
        }
    }

    // Add click event listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});
