import django_filters
from product.models import Product
from skill.models import Skill

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
