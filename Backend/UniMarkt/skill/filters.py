import django_filters

from skill.models import Skill


class SkillFilter(django_filters.FilterSet):

    price_min = django_filters.NumberFilter(field_name="charge_per_hour", lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name="charge_per_hour", lookup_expr='lte')

    module = django_filters.CharFilter(field_name="module", lookup_expr='icontains')
    description = django_filters.CharFilter(field_name="description", lookup_expr='icontains')
    skill_category__name = django_filters.CharFilter(field_name="skill_category__name", lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ['charge_per_hour','module', 'description', 'skill_category__name']