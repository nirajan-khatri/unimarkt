from django.db import models
from django.conf import settings

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Degree(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='degrees')

    def __str__(self):
        return f"{self.name} ({self.department.name})"

class SkillCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Skill(models.Model):
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('approved', 'approved'),
        ('rejected', 'rejected'),
    ]

    skill_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    skill_category = models.ForeignKey(SkillCategory, on_delete=models.PROTECT, related_name='skills', default=None, null=True, blank=True)
    module = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField()
    charge_per_hour = models.DecimalField(max_digits=6, decimal_places=2)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='skills')
    degree = models.ForeignKey(Degree, on_delete=models.PROTECT, related_name='skills')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills')
    isArchived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)


    def __str__(self):
        return f"{self.skill_id} - {self.module}"

class AvailableTimeSlot(models.Model):
    DAYS_OF_WEEK = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('booked', 'Booked'),
    ]

    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='available_time_week')
    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')


    def __str__(self):
        return f"{self.day} {self.start_time}-{self.end_time}"