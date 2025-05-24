from drf_yasg import openapi
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser

from .filters import ProductFilter
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Product.objects.filter()
    serializer_class = ProductSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name', 'sub_category__name']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    parser_classes = [MultiPartParser]

    # TODO: Add permissions later

    @swagger_auto_schema(tags=["Products"],
                         operation_description="Filter products by price, category name, sub category name, name, description, status and order by created_at or price",
                         manual_parameters=[
                             openapi.Parameter("price", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by price"),
                             openapi.Parameter("category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by category name"),
                             openapi.Parameter("sub_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by sub category name"),
                             openapi.Parameter("name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search product name"),
                             openapi.Parameter("description", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search product description"),
                             openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="product status - pending, approved, sold-out, rejected"),

                         ],
                         )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
