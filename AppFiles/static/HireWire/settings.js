document.addEventListener('DOMContentLoaded', function () {
    const backBtn = document.getElementById("back-to-dashboard");
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "/back/";
        });
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    const confirmation = document.getElementById('confirmation');
    const messageId = document.getElementById('messageId');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fakeId = 'HW-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            if (messageId) messageId.textContent = fakeId;
            if (confirmation) {
                confirmation.classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    confirmation.classList.remove('show');
                }, 5000);
            }
        });
    }

    const popup = document.getElementById("popupMessage");
    if (popup && popup.textContent.trim() !== "") {
        popup.style.display = "block";
        setTimeout(() => {
            popup.style.display = "none";
        }, 4000);
    }
});

function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return cookieValue ? cookieValue.split('=')[1] : null;
}
