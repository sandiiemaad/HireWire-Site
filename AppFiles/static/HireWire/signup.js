document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const errorContainer = document.getElementById('error-container');
    const passwordInput = document.getElementById('id_password1'); // Match your password field ID

    // Real-time password validation (new code)
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const requirements = {
                length: password.length >= 10,
                upper: /[A-Z]/.test(password),
                number: /\d/.test(password),
                special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
            };
            
            // Update UI indicators
            Object.keys(requirements).forEach(key => {
                const element = document.querySelector(`.req-${key}`);
                if (element) {
                    element.classList.toggle('valid', requirements[key]);
                    element.classList.toggle('invalid', !requirements[key]);
                }
            });
        });
    }

    // Existing form submission handler
    form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { throw data; });
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.redirect_url) {
            window.location.href = data.redirect_url;
        }
    })
    .catch(errorData => {
        showError(errorData.errors || "Something went wrong.");
    });
});


    function showError(errors) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'block';

    if (typeof errors === 'string') {
        errorContainer.innerHTML = `<p>${errors}</p>`;
    } else {
        const ul = document.createElement('ul');
        for (const field in errors) {
            errors[field].forEach(msg => {
                const li = document.createElement('li');
                li.textContent = `${field}: ${msg}`;
                ul.appendChild(li);
            });
        }
        errorContainer.appendChild(ul);
    }
}

});