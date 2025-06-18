import django_filters
from .models import JobPosting


class JobPostingFilter(django_filters.FilterSet):
    # Similar to ProductFilter
    title = django_filters.CharFilter(field_name="title", lookup_expr='icontains')
    description = django_filters.CharFilter(field_name="description", lookup_expr='icontains')
    qualifications = django_filters.CharFilter(field_name="qualifications", lookup_expr='icontains')
    
    department = django_filters.NumberFilter(field_name="department__id")
    department__name = django_filters.CharFilter(field_name="department__name", lookup_expr='icontains')
    
    job_type = django_filters.ChoiceFilter(choices=JobPosting.JOB_TYPES)
    status = django_filters.ChoiceFilter(choices=JobPosting.STATUS_CHOICES)
    
    class Meta:
        model = JobPosting
        fields = ['title', 'description', 'qualifications', 'department', 'job_type', 'status']