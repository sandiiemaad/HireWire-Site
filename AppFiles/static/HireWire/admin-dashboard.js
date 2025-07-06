document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('jobsTableBody');
    const csrftoken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
    const jobsDropdown = document.getElementById('jobsDropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    function populateJobsDropdown(jobs) {
        jobsDropdown.innerHTML = '';
        
        if (jobs.length === 0) {
            jobsDropdown.innerHTML = '<li>No jobs found</li>';
            return;
        }
        
        const header = document.createElement('li');
        header.className = 'dropdown-header';
        header.textContent = 'Recent Jobs';
        jobsDropdown.appendChild(header);
        
        jobs.slice(0, 10).forEach(job => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="/jobs/${job.id}/edit/">
                    ${job.title} (${job.position})
                </a>
                <span class="job-status ${job.status === 'active' ? 'active' : 'inactive'}">
                    ${job.status}
                </span>
            `;
            jobsDropdown.appendChild(li);
        });
        
        // Add view all link if more than 10 jobs
        if (jobs.length > 10) {
            const viewAll = document.createElement('li');
            viewAll.innerHTML = '<a href="#" style="color: var(--electric-blue);">View all jobs →</a>';
            viewAll.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.jobs-table').scrollIntoView({ behavior: 'smooth' });
                jobsDropdown.classList.remove('show');
            });
            jobsDropdown.appendChild(viewAll);
        }
    }

    function populateTable(jobs) {
        tableBody.innerHTML = '';

        if (jobs.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">No jobs found</td>
                </tr>
            `;
            return;
        }

        jobs.forEach(job => {
            const row = document.createElement('tr');
            row.setAttribute('data-job-id', job.id); 
            row.innerHTML = `
                <td>${job.title}</td>
                <td>${job.position}</td>
                <td>${job.salary.toLocaleString()}</td>
                <td>${new Date(job.post_date).toISOString().split('T')[0]}</td>
                <td>
                    <span class="status-badge ${job.status === 'active' ? 'active' : 'inactive'}">
                        ${job.status}
                    </span>
                </td>
                <td>${job.experience} year${job.experience !== 1 ? 's' : ''}</td>
                <td>
                    <a href="/jobs/${job.id}/edit/" class="btn-edit">Edit</a>
                    <button class="btn-delete" data-job-id="${job.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', deleteJob);
        });
    }

    function deleteJob() {
        const jobId = this.dataset.jobId;
        if (confirm('Are you sure you want to delete this job?')) {
            fetch(`/delete-job/${jobId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`tr[data-job-id="${jobId}"]`).remove();
                    alert('Job deleted successfully!');
                    // Reload jobs to update dropdown
                    loadJobs();
                } else {
                    alert(data.error || 'Failed to delete job.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the job.');
            });
        }
    }

    // Load jobs from API
    function loadJobs() {
        fetch('/api/jobs/')
            .then(response => response.json())
            .then(data => {
                populateTable(data);
                populateJobsDropdown(data);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7">Error loading jobs. Please try again.</td>
                    </tr>
                `;
                jobsDropdown.innerHTML = '<li>Error loading jobs</li>';
            });
    }

    // Toggle dropdown visibility
    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        jobsDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.jobs-dropdown')) {
            jobsDropdown.classList.remove('show');
        }
    });

    // Initial load
    loadJobs();

    // Edit modal handling
    const editModal = document.getElementById('editModal');
    const editJobForm = document.getElementById('editJobForm');
    
    // Handle edit form submission
    editJobForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const jobId = document.getElementById('editJobId').value;
        const formData = new FormData(editJobForm);
        
        fetch(EDIT_JOB_URL + jobId, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Job updated successfully!');
                editModal.style.display = 'none';
                loadJobs(); // Refresh the table
            } else {
                alert(data.error || 'Failed to update job.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the job.');
        });
    });
});