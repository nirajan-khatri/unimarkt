from drf_yasg import openapi
from rest_framework import viewsets, filters, mixins, status
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import  JSONParser
from rest_framework.response import Response

from .filters import ProductFilter
from .models import Product,Category,SubCategory
from .serializers import ProductSerializer, SubCategorySerializer, CategorySerializer, ProductCreateSerializer, \
    ProductUpdateSerializer


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Product.objects.filter()
    serializer_class = ProductSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    parser_classes = [JSONParser]

    @swagger_auto_schema(tags=["Products"],
                         operation_description="Filter products by min-price, max-price, category name, sub category name, name, description, status and order by created_at or price",
                         manual_parameters=[
                             openapi.Parameter("price_min", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by min price"),
                             openapi.Parameter("price_max", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by max price"),
                             openapi.Parameter("category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by category name"),
                             openapi.Parameter("sub_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by sub category name"),
                             openapi.Parameter("name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search product name"),
                             openapi.Parameter("description", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search product description"),
                             openapi.Parameter("pickup_location", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search product pickup location"),
                             openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="product status - pending, approved, sold-out, rejected"),

                         ],
                         )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(request_body=ProductCreateSerializer, tags=["Products"])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(request_body=ProductUpdateSerializer, tags=["Products"])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
   

    
class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    List all categories or retrieve a specific category_id.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @swagger_auto_schema(
        tags=["Categories"],
        manual_parameters=[openapi.Parameter("name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                              required=False, description="Optional category name to filter by")])
    def list(self, request, *args, **kwargs):
        name = request.query_params.get('name')
        if name:
            queryset = self.queryset.filter(name=name)
            if not queryset.exists():
                return Response({'detail': f'Category with name={name} not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            queryset = self.queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class SubCategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

    @swagger_auto_schema( ags=["SubCategories"], manual_parameters=[openapi.Parameter("category_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=False, 
         description="Filter subcategories by category ID")])
    def list(self, request, *args, **kwargs):
        category_id = request.query_params.get("category_id")
        queryset = self.queryset

        if category_id:
            queryset = queryset.filter(category__id=category_id)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
