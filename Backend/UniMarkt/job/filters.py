# filters.py
import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    min_salary = django_filters.NumberFilter(field_name="salary_per_hour", lookup_expr='gte')
    max_salary = django_filters.NumberFilter(field_name="salary_per_hour", lookup_expr='lte')
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr='icontains')
    location = django_filters.CharFilter(lookup_expr='icontains')
    qualifications = django_filters.CharFilter(lookup_expr='icontains')
    degree = django_filters.CharFilter(lookup_expr='icontains')
    title = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.CharFilter()
    user_id = django_filters.NumberFilter(field_name='user__id')
    exclude_user_id = django_filters.NumberFilter(field_name="user_id", exclude=True)

    isArchived = django_filters.BooleanFilter()

    class Meta:
        model = Job
        fields = []
