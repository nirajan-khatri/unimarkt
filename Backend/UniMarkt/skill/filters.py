import django_filters

from skill.models import Skill


class SkillFilter(django_filters.FilterSet):

    price_min = django_filters.NumberFilter(field_name="charge_per_hour", lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name="charge_per_hour", lookup_expr='lte')

    module = django_filters.CharFilter(field_name="module", lookup_expr='icontains')
    description = django_filters.CharFilter(field_name="description", lookup_expr='icontains')
    skill_category__name = django_filters.CharFilter(field_name="skill_category__slug", lookup_expr='icontains')
    user_id = django_filters.NumberFilter(field_name="user_id")
    exclude_user_id = django_filters.NumberFilter(field_name="user_id", exclude=True)
    isArchived = django_filters.BooleanFilter(field_name="isArchived")
    status = django_filters.ChoiceFilter(
            field_name="status",
            choices=[("pending", "pending"), ("approved", "approved"), ("rejected", "rejected")]
        )

    class Meta:
        model = Skill
        fields = ['charge_per_hour','module', 'description', 'skill_category__name']