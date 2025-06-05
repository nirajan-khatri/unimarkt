import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr='lte')

    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
    description = django_filters.CharFilter(field_name="description", lookup_expr='icontains')
    category__name = django_filters.CharFilter(field_name="category__name", lookup_expr='icontains')
    sub_category__name = django_filters.CharFilter(field_name="sub_category__name", lookup_expr='icontains')
    pickup_location = django_filters.CharFilter(field_name="pickup_location", lookup_expr='icontains')

    class Meta:
        model = Product
        fields = ['price', 'name', 'description', 'category__name', 'sub_category__name', 'pickup_location']

