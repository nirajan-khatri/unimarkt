from django.db import models
from django.conf import settings


class JobCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Job(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    job_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    isArchived = models.BooleanField(default=False)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job')
    category = models.ForeignKey(JobCategory, on_delete=models.PROTECT, related_name='job')

    description = models.TextField()
    qualifications = models.TextField(blank=True, null=True)
    degree = models.TextField(default="any")
    contact_email = models.EmailField()
    salary_per_hour = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Job {self.job_id} - {self.title}"
