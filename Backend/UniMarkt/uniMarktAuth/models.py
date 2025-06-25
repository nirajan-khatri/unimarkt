from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class Role(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
         ('superuser', 'Superuser')
    ]
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field is required")

        email = self.normalize_email(email)

        # Set default role to 'user' if not provided
        extra_fields['role'] = Role.objects.get_or_create(name='user')[0]

        is_admin = extra_fields.get('is_admin', False)
        is_staff = extra_fields.get('is_staff', False)
        
           # ✅ Check both are False
        if not is_admin and not is_staff:
            extra_fields['status'] = 'approved'
        else:
            extra_fields['status'] = 'pending'

        

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("role", Role.objects.get_or_create(name='superuser')[0])
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    SECURITY_QUESTION_CHOICES = [
        ('mother_maiden', "What is your mother's maiden name?"),
        ('first_pet', "What was your first pet's name?"),
        ('favorite_book', "What is your favorite book?")
    ]

    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('approved', 'approved'),
        ('rejected', 'rejected'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    is_admin = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    security_question1 = models.CharField(max_length=50, choices=SECURITY_QUESTION_CHOICES, blank=True, null=True)
    answer1 = models.CharField(max_length=255,null=True, blank=True)
    security_question2 = models.CharField(max_length=50, choices=SECURITY_QUESTION_CHOICES, blank=True, null=True)
    answer2 = models.CharField(max_length=255, null=True, blank=True)
    security_question3 = models.CharField(max_length=50, choices=SECURITY_QUESTION_CHOICES, blank=True, null=True)
    answer3 = models.CharField(max_length=255,null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email
