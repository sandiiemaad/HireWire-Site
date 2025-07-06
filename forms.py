from django import forms
from .models import Job
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordChangeForm
import re
from django.contrib.auth.forms import PasswordChangeForm
from .models import JobSeekerProfile
from django.contrib.auth.forms import PasswordChangeForm
from django.core.exceptions import ValidationError
from django.utils.html import escape
from django.contrib.auth.forms import PasswordChangeForm
from django.core.exceptions import ValidationError
from django.utils.html import escape

class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = '__all__'  


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text="Minimum 10 characters with at least one uppercase letter, number, and special character.",
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'user_type']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add Bootstrap classes to all fields
        for field_name, field in self.fields.items():
            field.widget.attrs.update({'class': 'form-control'})

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email

class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add Bootstrap classes to all fields
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

        self.fields['new_password1'].help_text = (
            "Your password must contain: "
            "10+ characters, "
            "at least one uppercase letter, "
            "one number, "
            "and one special character."
        )

    def clean_new_password1(self):
        password = self.cleaned_data.get('new_password1')

        if not password:
            raise ValidationError("Please enter a new password.")

        if len(password) < 10:
            raise ValidationError("Password must be at least 10 characters long.")

        if not any(char.isdigit() for char in password):
            raise ValidationError("Password must contain at least one digit.")

        if not any(char.isupper() for char in password):
            raise ValidationError("Password must contain at least one uppercase letter.")

        special_chars = "!@#$%^&*()-_=+[]{};:'\"\\|,.<>?/"
        if not any(char in special_chars for char in password):
            raise ValidationError("Password must contain at least one special character.")
        return password

    def get_errors_as_json(self):
        """
        Helper method to return form errors in a structured JSON format.
        """
        errors = {}
        for field, error_list in self.errors.items():
            errors[field] = [escape(e) for e in error_list]
        return errors

class JobSeekerProfileForm(forms.ModelForm):
    class Meta:
        model = JobSeekerProfile
        fields = '__all__'
        widgets = {
            'education': forms.Select(attrs={'class': 'form-control'}),
            'grad_field': forms.TextInput(attrs={'class': 'form-control'}),

        }