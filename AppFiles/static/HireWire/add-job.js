document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // Apply dark mode based on localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }

    const form = document.getElementById("addJobForm");

    if (form) {
        console.log('Form found:', form);

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Get CSRF token
            const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
            if (!csrfToken) {
                console.error('CSRF token not found');
                return;
            }

            const formData = new FormData(form);
            formData.append('company', 'Hire Wire');
            formData.append('status', 'active');

            // Send data to server
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(JSON.stringify(data));
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert("Job posted successfully!");
                        window.location.href = data.redirect_url || "{% url 'admin-dashboard' %}";
                    } else {
                        if (data.errors) {
                            displayFormErrors(data.errors);
                        } else {
                            alert("Error: " + (data.message || "Unknown error occurred"));
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("An error occurred while submitting the form.");
                });
        });
    } else {
        console.error('Form not found:', form);
    }
});

function displayFormErrors(errors) {
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    for (const [field, messages] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message';
            errorContainer.style.color = 'red';
            errorContainer.textContent = messages.join(', ');
            input.parentNode.insertBefore(errorContainer, input.nextSibling);
        }
    }
}
