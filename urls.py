from django.urls import path, include
from django.contrib import admin
from . import views
from .views import jobs_api

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Make welcome page the root URL (instead of redirecting to signup)
    path('', views.welcome_view, name='welcome'),  # Changed from RedirectView
    
    # Authentication
    path('accounts/', include('django.contrib.auth.urls')),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Admin paths
    path('form/', views.admin_form, name='admin_form'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Job paths
    path('add-job/', views.add_job, name='add_job'),
    path('api/jobs/', views.jobs_list, name='jobs_list'),
    path('delete-job/<int:job_id>/', views.delete_job, name='delete_job'),
    path('jobs/<int:job_id>/edit/', views.edit_job_page, name='edit_job'),
    path('update-job/<int:job_id>/', views.update_job, name='update_job'),
    
    # User paths
    path('job-seeker/', views.job_seeker_view, name='job-seeker'),
    path('user-dashboard/', views.user_dashboard, name='user-dashboard'),
    path('edit-profile/', views.edit_profile, name='edit-profile'),
    path('settings/', views.settings_view, name='settings'),
    path('back/', views.back_to_dashboard, name='back-to-dashboard'),
    path('applied-jobs/', views.applied_jobs_view, name='applied-jobs'),
    
    # Application paths
    path('quick-apply/<int:job_id>/', views.quick_apply, name='quick-apply'),
    path('full-apply/<int:job_id>/', views.full_apply, name='full-apply'),
    path('application-success/', views.application_success, name='application-success'),

    #for api
    path('api/jobs/', jobs_api, name='jobs_api'),
]