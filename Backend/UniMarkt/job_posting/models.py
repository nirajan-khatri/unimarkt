from django.db import models
from django.conf import settings
from skill.models import Department


class JobPosting(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('archived', 'Archived'),
        ('deleted', 'Deleted'),
    ]
    
    JOB_TYPES = [
        ('research', 'Research Assistant'),
        ('hiwi', 'HiWi'),
        ('tutoring', 'Tutoring'),
        ('administrative', 'Administrative'),
        ('other', 'Other'),
    ]
    
    job_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    qualifications = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='job_postings')
    job_type = models.CharField(max_length=20, choices=JOB_TYPES, default='hiwi')
    remuneration = models.CharField(max_length=100)  # e.g., "12€/hour", "450€/month"
    contact_email = models.EmailField()
    contact_name = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_postings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rejection_reason = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.job_id} - {self.title} ({self.department.name})"