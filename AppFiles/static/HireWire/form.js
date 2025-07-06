document.getElementById("admin-form").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        }
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
            return; // Exit the callback to prevent further processing
        }
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        if (data && data.redirect_url) {
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error submitting form");
    });
});