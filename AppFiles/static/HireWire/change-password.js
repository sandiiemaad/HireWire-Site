document.addEventListener('DOMContentLoaded', function() {
    function showError(errors) {
        console.error('Error:', errors);
        const container = document.getElementById('password-error');
        if (container) {
            if (typeof errors === 'string') {
                container.textContent = errors;
            } else if (typeof errors === 'object') {
                // Handle Django form error structure
                let errorHtml = '';
                for (const field in errors) {
                    errorHtml += `<strong>${field}:</strong> `;
                    errorHtml += errors[field].map(err => err.message).join('<br>');
                    errorHtml += '<br>';
                }
                container.innerHTML = errorHtml;
            }
            container.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert(typeof errors === 'object' ? JSON.stringify(errors) : errors);
        }
    }

    function showSuccess(message) {
        console.log('Success:', message);
        const container = document.getElementById('password-success');
        if (container) {
            container.innerHTML = `<strong>✅ ${message}</strong>`;
            container.style.display = 'block';
            setTimeout(() => container.style.display = 'none', 5000);
        } else {
            alert(message);
        }
    }

    // Get the form and CSRF token
    const form = document.getElementById('change-password-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        const errorContainer = document.getElementById('password-error');
        const successContainer = document.getElementById('password-success');

        // Clear previous messages
        if (errorContainer) errorContainer.style.display = 'none';
        if (successContainer) successContainer.style.display = 'none';

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Changing...';

            const formData = new FormData(form);
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                }
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    showSuccess(data.message);
                    form.reset();
                } else {
                    showError(data.errors || 'Password change failed');
                }
            } else {
                showError(data.errors || `Server error: ${response.status}`);
            }
        } catch (error) {
            console.error('AJAX error:', error);
            showError('Network error - please try again');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});