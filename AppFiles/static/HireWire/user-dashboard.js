document.addEventListener("DOMContentLoaded", () => {
    const jobsContainer = document.getElementById("jobsContainer");
    const jobSearchInput = document.getElementById("jobSearch");
    const searchButton = document.getElementById("searchButton");
    const clearButton = document.getElementById("clearButton");
    const yearsExperienceInput = document.getElementById("yearsExperience");


    
    let allJobs = [];
    
    function fetchJobs() {
        fetch('/api/jobs/')
            .then(response => response.json())
            .then(jobs => {
                allJobs = jobs;
                displayJobs(jobs);
            })
            .catch(error => {
                console.error('Error:', error);
                jobsContainer.innerHTML = "<p>Error fetching jobs.</p>";
            });
    }
    
    function displayJobs(jobs) {
        jobsContainer.innerHTML = "";
        
        if (jobs.length === 0) {
            jobsContainer.innerHTML = "<p>No jobs match your criteria.</p>";
            return;
        }
        
        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "job-card";
            
            jobCard.innerHTML = `
                <h2>${job.title}</h2>
                <div class="job-card-header-meta">
                    <p><i class="fas fa-location-marker"></i> ${job.location}</p>
                    <p><i class="fas fa-clock"></i> ${job.post_date}</p>
                </div>
                <div class="job-card-body">
                    <div class="job-info-item">
                        <span class="info-label">Position:</span>
                        <span class="info-value">${job.position}</span>
                    </div>
                    <div class="job-info-item">
                        <span class="info-label">Salary:</span>
                        <span class="info-value">${job.salary}</span>
                    </div>
                    <div class="job-info-item">
                        <span class="info-label">Experience:</span>
                        <span class="info-value">${job.experience}</span>
                    </div>
                    <div class="job-info-item">
                        <span class="info-label">Category:</span>
                        <span class="info-value">${job.category}</span>
                    </div>
                    <div class="job-description">
                        <p>${job.description}</p>
                    </div>
                    <div class="apply-buttons">
                        <button class="quick-apply-btn" data-job-id="${job.id}">Quick Apply</button>
                        <button class="full-apply-btn" data-job-id="${job.id}">Full Apply</button>
                    </div>
                </div>
            `;
            jobsContainer.appendChild(jobCard);
        });
    }
    
function filterJobs() {
    const searchTerm = jobSearchInput.value.toLowerCase();
    const yearsExperience = yearsExperienceInput.value;
    
    const filteredJobs = allJobs.filter(job => {
        // Search term matching (case-insensitive)
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                             job.description.toLowerCase().includes(searchTerm) ||
                             job.position.toLowerCase().includes(searchTerm);
        
        // Experience years matching
        let matchesExperience = true;
        if (yearsExperience) {
            // Extract numbers from experience string (e.g., "3-5 years" -> [3,5])
            const expNumbers = job.experience.match(/\d+/g) || [];
            const enteredYears = parseInt(yearsExperience);
            
            if (expNumbers.length === 1) {
                // Case: "5+ years" or "3 years"
                const jobYears = parseInt(expNumbers[0]);
                matchesExperience = enteredYears >= jobYears;
            } else if (expNumbers.length >= 2) {
                // Case: "3-5 years"
                const minYears = parseInt(expNumbers[0]);
                const maxYears = parseInt(expNumbers[1]);
                matchesExperience = enteredYears >= minYears && enteredYears <= maxYears;
            } else {
                // No numbers found in experience string
                matchesExperience = false;
            }
        }
        
        return matchesSearch && matchesExperience;
    });
    
    displayJobs(filteredJobs);
}

    
    searchButton.addEventListener("click", filterJobs);
    jobSearchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            filterJobs();
        }
    });
    
    clearButton.addEventListener("click", () => {
        jobSearchInput.value = "";
        yearsExperienceInput.value = "";
        displayJobs(allJobs);
    });
    
    fetchJobs();
});

// Keep your existing click event handlers
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("quick-apply-btn")) {
        const jobId = e.target.dataset.jobId;
        window.location.href = `/quick-apply/${jobId}`;
    }
    else if (e.target.classList.contains("full-apply-btn")) {
        const jobId = e.target.dataset.jobId;
        window.location.href = `/full-apply/${jobId}`;
    }
});