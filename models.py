from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import datetime

class CompanyAdmin(models.Model):
    class Meta:
        app_label = 'HireWire'
    
    company_name = models.CharField(max_length=100)
    company_field = models.CharField(max_length=100)
    admin_position = models.CharField(max_length=100)
    location = models.CharField(max_length=50)
    
    def __str__(self):
        return self.company_name

class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
    ]
    
    CATEGORY_CHOICES = [
        ('development', 'Development'),
        ('design', 'Design'),
        ('marketing', 'Marketing'),
        ('business', 'Business'),
    ]
    
    LOCATION_CHOICES = [
        ('remote', 'Remote'),
        ('cairo', 'Cairo'),
        ('giza', 'Giza'),
        ('alexandria', 'Alexandria'),
    ]
    
    
    title = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    experience = models.CharField(max_length=100)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    salary_min = models.IntegerField()
    salary_max = models.IntegerField(null=True, blank=True)
    location = models.CharField(max_length=20, choices=LOCATION_CHOICES)
    description = models.TextField()
    requirements = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
#For user information table
class User(AbstractUser):
    USER_TYPES = (
        ('job-seeker', 'Job Seeker'),
        ('company-admin', 'Company Admin'),
    )
    user_type = models.CharField(max_length=30, choices=USER_TYPES)


class JobSeekerProfile(models.Model):
    education = models.CharField(max_length=100)
    gradField = models.CharField(max_length=100)  # Changed from grad_field
    graddegree = models.CharField(max_length=100)  # Changed from grad_degree
    gpa = models.FloatField()
    years = models.IntegerField()  # Changed from experience_years
    preferences = models.CharField(max_length=10)
    workfrom = models.CharField(max_length=10)  # Changed from work_from
    location = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.gradField} - {self.education}"

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100,null=True)
    last_name = models.CharField(max_length=100,null=True)
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=20,null=True)
    last_projects = models.TextField(null=True)
    experience = models.PositiveIntegerField(null=True)
    skills = models.TextField(null=True)
    expected_salary = models.PositiveIntegerField(null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)  # if you want resume upload

    applied_at = models.DateTimeField(auto_now_add=True)
