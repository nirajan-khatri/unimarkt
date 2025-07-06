from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import pyotp
import qrcode
import base64
from io import BytesIO

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
        extra_fields.setdefault("role_id", 4)
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

    # 2FA fields
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True, null=True)
    backup_codes = models.JSONField(default=list, blank=True)

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

    def generate_two_factor_secret(self):
        """Generate a new 2FA secret key"""
        return pyotp.random_base32()

    def get_two_factor_qr_code(self, secret=None):
        """Generate QR code for Google Authenticator"""
        if not secret:
            secret = self.two_factor_secret
        
        if not secret:
            return None

        # Create TOTP URI
        totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=self.email,
            issuer_name="UniMarkt"
        )

        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(totp_uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer)  # Remove the format parameter
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"

    def verify_two_factor_code(self, code):
        """Verify 2FA code"""
        if not self.two_factor_secret:
            return False
        
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(code)

    def generate_backup_codes(self, count=8):
        """Generate backup codes for 2FA"""
        import secrets
        codes = []
        for _ in range(count):
            code = secrets.token_hex(4).upper()[:8]  # 8-character hex code
            codes.append(code)
        return codes

    def verify_backup_code(self, code):
        """Verify and consume a backup code"""
        if code in self.backup_codes:
            self.backup_codes.remove(code)
            self.save()
            return True
        return False
