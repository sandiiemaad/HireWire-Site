document.addEventListener("DOMContentLoaded", () => {
    const job = JSON.parse(localStorage.getItem("selectedJob"));
    if (!job) return;

    document.querySelector(".job-summary h2").textContent = job.title;
    document.querySelector(".job-summary .company").textContent = job.company;

    const details = document.querySelectorAll(".job-summary .detail span");
    details[0].textContent = job.location;
    details[1].textContent = job.salary;
    details[2].textContent = job.type;

    document.querySelector(".job-description p").textContent = job.description;

    document.querySelector('input[name="job_id"]').value = job.id || "";
  });