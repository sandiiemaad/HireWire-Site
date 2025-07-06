window.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const darkToggle = document.getElementById('darkModeToggle');
    const neonToggle = document.getElementById('neonModeToggle');

    // Apply dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }

    // Apply neon mode from localStorage
    if (localStorage.getItem('neonMode') === 'enabled') {
        body.classList.add('neon-mode');
    } else {
        body.classList.remove('neon-mode');
    }

    // Handle dark mode toggle
    if (darkToggle) {
        darkToggle.checked = localStorage.getItem('darkMode') === 'enabled';
        darkToggle.addEventListener('change', () => {
            const isEnabled = darkToggle.checked;
            body.classList.toggle('dark-mode', isEnabled);
            localStorage.setItem('darkMode', isEnabled ? 'enabled' : 'disabled');
        });
    }

    // Handle neon mode toggle
    if (neonToggle) {
        neonToggle.checked = localStorage.getItem('neonMode') === 'enabled';
        neonToggle.addEventListener('change', () => {
            const isEnabled = neonToggle.checked;
            body.classList.toggle('neon-mode', isEnabled);
            localStorage.setItem('neonMode', isEnabled ? 'enabled' : 'disabled');
        });
    }
});
