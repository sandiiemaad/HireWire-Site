document.addEventListener('DOMContentLoaded', function() {
    const statusFilters = document.querySelectorAll('.status-filter');
    
    statusFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            statusFilters.forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            
            const status = this.dataset.status;
            const jobCards = document.querySelectorAll('.job-card');
            
            jobCards.forEach(card => {
                if (status === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.dataset.status === status) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
    
    document.querySelectorAll('.withdraw-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const applicationId = this.dataset.applicationId;
            if (confirm('Are you sure you want to withdraw this application?')) {
                fetch(`/withdraw-application/${applicationId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    },
                    credentials: 'same-origin'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.closest('.job-card').remove();
                    }
                });
            }
        });
    });
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});