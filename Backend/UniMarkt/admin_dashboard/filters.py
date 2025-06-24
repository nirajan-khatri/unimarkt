import django_filters
from product.models import Product
from skill.models import Skill
from job.models import Job
from uniMarktAuth.models import User

class ProductFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['status']

class SkillFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Skill
        fields = ['status']

class JobFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Job
        fields = ['status']
        
class UserFilter(django_filters.FilterSet):
    is_superuser = django_filters.BooleanFilter()

    is_active = django_filters.BooleanFilter()
    is_staff = django_filters.BooleanFilter()
    is_admin= django_filters.BooleanFilter()

    role_name = django_filters.CharFilter(field_name='role__name', lookup_expr='iexact')  # case-insensitive exact match


    class Meta:
        model = User
        fields = ['is_superuser','is_active', 'is_staff', 'role_name']
