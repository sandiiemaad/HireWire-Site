document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('messageContainer');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        messageContainer.innerHTML = '';

        const formData = new FormData(loginForm);

        try {
            const response = await fetch(loginForm.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred. Please try again.');
            }

            const data = await response.json();

            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                throw new Error('Unexpected response from server.');
            }
        } catch (error) {
            messageContainer.innerHTML = `<div class="error-message">❌ ${error.message}</div>`;
        }
    });
});
