# HireWire – Job Search Website

HireWire is a simple and efficient job search platform built using HTML, CSS, JavaScript, and Django (Python) following the MVC architecture. The website supports two types of users: Company Admins and Job Seekers, each with tailored features to enhance the job recruitment and application process.

🔑 Key Features:
👨‍💼 Company Admin:
-Register with a form including username, password, email, and a flag for company admin (is_company_admin). If selected, additional company details are required.

-Login securely to access the dashboard.

-Add Job Opportunities with details such as job ID, title, salary, company name, description, years of experience, job status (open or closed), and created by the logged-in admin.

-View Jobs posted by their company.

-Edit job postings to update or correct details.

-Delete jobs no longer available.

👤 Job Seeker (User):
-Register with username, password, email, and a flag for standard user.
-Login to access job listings and application features.
-Search Jobs by title or required years of experience.
-View Available Jobs and browse listings.
-View Job Details on a dedicated job page.
-Apply for Jobs directly from the job detail page.
-Track Applications by viewing the list of jobs they’ve applied to.

🌐 UI & Navigation:
-A responsive navigation bar is included and appears consistently across all pages.
-The navigation menu is dynamically updated based on the type of logged-in user (admin or job seeker), enhancing user experience.
