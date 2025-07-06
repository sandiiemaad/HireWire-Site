from django.shortcuts import render, redirect
from .models import JobApplication
from .forms import CustomUserCreationForm
from django.shortcuts import render, redirect
from .forms import JobSeekerProfileForm
from .models import CompanyAdmin
from .models import Job
from .forms import JobForm
from .forms import CustomUserCreationForm
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from .forms import CustomPasswordChangeForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import get_user_model, authenticate, login
from django.db.models import Q
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import JobSeekerProfile 

def admin_form(request):
    if request.method == 'POST':
        company_name = request.POST.get('compname')
        company_field = request.POST.get('compfeild')
        admin_position = request.POST.get('addpostion')
        location = request.POST.get('location')
        
        CompanyAdmin.objects.create(
            company_name=company_name,
            company_field=company_field,
            admin_position=admin_position,
            location=location
        )
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'redirect_url': reverse('admin-dashboard')})
        return redirect('admin_dashboard')
    return render(request, 'HireWire/form.html')

def admin_dashboard(request):
    jobs = Job.objects.all()
    return render(request, 'HireWire/admin-dashboard.html', {'jobs': jobs})

def add_job(request):
    if request.method == 'POST':
        form = JobForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('admin_dashboard')  
    else:
        form = JobForm() 
    return render(request, 'HireWire/add-job.html', {'form': form})

def jobs_list(request):
    jobs = Job.objects.all()
    data = []
    for job in jobs:
        data.append({
            'id': job.id,
            'title': job.title,
            'position': job.position,
            'salary': job.salary_min, 
            'post_date': job.created_at,
            'status': 'active',  
            'experience': job.experience,
            'category': job.category,
            'location': job.location,
            'description': job.description,
        })
    return JsonResponse(data, safe=False)

def delete_job(request, job_id):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
    try:
        job = Job.objects.get(pk=job_id)
        job.delete()
        return JsonResponse({'success': True, 'message': 'Job deleted successfully'})
    except Job.DoesNotExist:
        return JsonResponse({
            'success': False, 
            'error': 'Job not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': str(e)
        }, status=500)
    
def edit_job(request, job_id):
    if request.method == 'POST':
        try:
            job = Job.objects.get(id=job_id)
            # Update job fields from request data
            data = json.loads(request.body)
            job.title = data.get('title', job.title)
            job.position = data.get('position', job.position)
            job.salary = data.get('salary', job.salary)
            job.type = data.get('type', job.type)
            job.save()
            
            return JsonResponse({
                'success': True,
                'job': {
                    'id': job.id,
                    'title': job.title,
                    'position': job.position,
                    'salary': job.salary,
                    'type': job.type
                }
            })
        except Job.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Job not found'}, status=404)
    
    return JsonResponse({'success': False, 'error': 'Invalid method'}, status=400)


def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                if user.user_type == 'job-seeker':
                    return JsonResponse({'success': True, 'redirect_url': '/job-seeker/'})
                elif user.user_type == 'company-admin':
                    return JsonResponse({'success': True, 'redirect_url': '/form/'})
            else:
                if user.user_type == 'job-seeker':
                    return redirect('job-seeker')
                elif user.user_type == 'company-admin':
                    return redirect('form')
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    else:
        form = CustomUserCreationForm()

    return render(request, 'HireWire/signup.html', {'form': form})



User = get_user_model()
def login_view(request):
    if request.method == 'POST':
        username_or_email = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user_obj = User.objects.get(Q(username=username_or_email) | Q(email=username_or_email))
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        if user is not None:
            login(request, user)
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                if user.user_type == 'job-seeker':
                    return JsonResponse({'redirect': '/user-dashboard/'})
                elif user.user_type == 'company-admin':
                    return JsonResponse({'redirect': '/admin-dashboard/'})
            else:
                if user.user_type == 'job-seeker':
                    return redirect('user-dashboard')
                elif user.user_type == 'company-admin':
                    return redirect('admin_dashboard')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'error': 'Invalid username/email or password'}, status=400)
            else:
                messages.error(request, '❌ Invalid username/email or password')

    return render(request, 'HireWire/login.html')


@login_required
def edit_profile(request):
    user = request.user
    try:
        profile = JobSeekerProfile.objects.get(user=user)
    except JobSeekerProfile.DoesNotExist:
        messages.error(request, "You don't have a profile yet. Please create one first.")
        return redirect('job-seeker')
    
    if request.method == 'POST':
        form = JobSeekerProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully!")
            return redirect('user-dashboard')
        else:
            messages.error(request, "Please correct the form errors.")
    else:
        form = JobSeekerProfileForm(instance=profile)
    
    return render(request, 'HireWire/edit-profile.html', {'form': form})



def user_dashboard(request):
    # Fetch all jobs from the Job model
    jobs = Job.objects.all()
    return render(request, 'HireWire/user-dashboard.html', {'jobs': jobs})


@login_required
def back_to_dashboard(request):
    if request.user.user_type == 'job-seeker':
        return redirect('user-dashboard')
    elif request.user.user_type == 'company-admin':
        return redirect('admin_dashboard')
    return redirect('admin_dashboard')


@login_required
def settings_view(request):
    if request.method == 'POST':
        password_form = CustomPasswordChangeForm(user=request.user, data=request.POST)
        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)  # Important to keep user logged in
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True, 
                    'message': 'Password changed successfully!'
                })
            messages.success(request, 'Password changed successfully!')
            return redirect('settings')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False, 
                'errors': password_form.errors.get_json_data()
            }, status=400)
        
        messages.error(request, 'Please correct the errors below.')
    
    password_form = CustomPasswordChangeForm(user=request.user)
    return render(request, 'HireWire/settings.html', {'password_form': password_form})


@login_required
def debug_view(request):
    if request.method == 'POST':
        return JsonResponse({
            'got_request': True,
            'is_ajax': request.headers.get('X-Requested-With') == 'XMLHttpRequest',
            'headers': dict(request.headers)
        })
    return render(request, 'debug.html')



@login_required
def logout_view(request):
    logout(request)
    return redirect('login')


def application_success(request):
    return render(request, 'hirewire/application-success.html')


@login_required
def quick_apply(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        resume = request.FILES.get('resume')
        if not (name and phone and resume):
            return HttpResponse("All fields are required.", status=400)
        file_path = default_storage.save(f"resumes/{resume.name}", ContentFile(resume.read()))
        from .models import JobApplication
        JobApplication.objects.create(
            job=job,
            applicant=request.user,
            resume=file_path
        )
        return redirect('application-success')

    return render(request, 'hirewire/quick-apply.html', {'job': job})


@login_required
def full_apply(request, job_id):
    job = get_object_or_404(Job, id=job_id)

    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        last_projects = request.POST.get('last_projects')
        experience = request.POST.get('experience')
        skills = request.POST.get('skills')
        expected_salary = request.POST.get('expected_salary')

        # Basic validation
        required_fields = [first_name, last_name, email, phone, last_projects, experience, skills, expected_salary]
        if not all(required_fields):
            return HttpResponseBadRequest("All fields are required.")

        # Save application in the database 
        JobApplication.objects.create(
            job=job,
            applicant=request.user,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            last_projects=last_projects,
            experience=experience,
            skills=skills,
            expected_salary=expected_salary,
        )

        return redirect('application-success')

    return render(request, 'hirewire/full-apply.html', {'job': job}) 


def job_seeker_view(request):
    if request.method == 'POST':
        try:
            JobSeekerProfile.objects.create(
                education=request.POST.get('education'),
                gradField=request.POST.get('gradField'),
                graddegree=request.POST.get('graddegree'),
                gpa=float(request.POST.get('gpa')),
                years=int(request.POST.get('years')),
                preferences=request.POST.get('preferences'),
                workfrom=request.POST.get('workfrom'),
                location=request.POST.get('location')
            )
            messages.success(request, "Profile saved successfully!")
            return redirect('user-dashboard')
        except Exception as e:
            messages.error(request, f"Error saving profile: {str(e)}")
            return redirect('job-seeker')
    
    return render(request, 'HireWire/job-seeker.html')



from django.contrib.auth.decorators import login_required

@login_required
def applied_jobs_view(request):
    status_filter = request.GET.get('status', 'all')
    
    applications = JobApplication.objects.filter(applicant=request.user)
    
    if status_filter != 'all':
        applications = applications.filter(status=status_filter)
        
    applications = applications.select_related('job').order_by('-applied_at')
    
    return render(request, 'HireWire/applied-jobs.html', {
        'applied_jobs': applications,
        'current_status': status_filter
    })


def welcome_view(request):
    return render(request, 'HireWire/welcome.html')  

def edit_job_page(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    return render(request, 'HireWire/edit-job.html', {'job': job})

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def update_job(request, job_id):
    if request.method == 'POST':
        try:
            job = Job.objects.get(id=job_id)
            job.title = request.POST.get('title')
            job.position = request.POST.get('position')
            job.salary_min = request.POST.get('salary')
            job.job_type = request.POST.get('job_type')
            job.save()
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True, 'message': 'Job updated'})
            else:
                return redirect('admin_dashboard')
                
        except Job.DoesNotExist:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'error': 'Job not found'}, status=404)
            raise Http404("Job not found")
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'error': str(e)}, status=500)
            raise e
        
from django.http import JsonResponse
from .models import Job
from django.views.decorators.http import require_GET

@require_GET
def jobs_api(request):
    jobs = Job.objects.all().order_by('-created_at')
    jobs_data = []
    
    for job in jobs:
        jobs_data.append({
            'id': job.id,
            'title': job.title,
            'position': job.position,
            'salary': job.salary_min,
            'status': 'active',
            'post_date': job.created_at.strftime('%Y-%m-%d'),
            'experience': job.experience,
        })
    
    return JsonResponse(jobs_data, safe=False)