from django.contrib import admin
from .models import JobPosting, JobApplication


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['job_id', 'title', 'department', 'job_type', 'status', 'posted_by', 'created_at']
    list_filter = ['status', 'job_type', 'department', 'created_at']
    search_fields = ['title', 'description', 'qualifications', 'posted_by__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Job Information', {
            'fields': ('title', 'description', 'qualifications', 'department', 'job_type')
        }),
        ('Contact Information', {
            'fields': ('contact_name', 'contact_email', 'contact_phone')
        }),
        ('Compensation', {
            'fields': ('remuneration',)
        }),
        ('Status', {
            'fields': ('status', 'rejection_reason', 'posted_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['approve_jobs', 'reject_jobs']
    
    def approve_jobs(self, request, queryset):
        queryset.update(status='approved', rejection_reason=None)
    approve_jobs.short_description = "Approve selected job postings"
    
    def reject_jobs(self, request, queryset):
        queryset.update(status='rejected')
    reject_jobs.short_description = "Reject selected job postings"


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['application_id', 'job_posting', 'applicant', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['job_posting__title', 'applicant__email']
    readonly_fields = ['applied_at']
    
    fieldsets = (
        ('Application Info', {
            'fields': ('job_posting', 'applicant', 'status')
        }),
        ('Application Details', {
            'fields': ('resume_file', 'cover_letter')
        }),
        ('Timestamp', {
            'fields': ('applied_at',)
        }),
    )