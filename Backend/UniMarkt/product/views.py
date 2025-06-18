from drf_yasg import openapi
from rest_framework import viewsets, filters, mixins, status
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import  JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination


from .filters import ProductFilter
from .models import Product,Category,SubCategory
from .serializers import ProductSerializer, SubCategorySerializer, CategorySerializer, ProductCreateSerializer, \
    ProductUpdateSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'hasNext': self.page.has_next(),
            'hasPrevious': self.page.has_previous(),
            'currentPage': self.page.number,
            'results': data
        })


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Product.objects.filter()
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    parser_classes = [JSONParser]
    
    def get_serializer_class(self):
        if self.action in ['update']:
            return ProductUpdateSerializer
        elif self.action == 'create':
            return ProductCreateSerializer
        return ProductSerializer

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
                                               description="product status - pending, approved,  rejected"), 
                             openapi.Parameter(
                                                        "user_id",
                                                        openapi.IN_QUERY,
                                                        type=openapi.TYPE_INTEGER,
                                                        description="Filter by user ID"
                                                    ),
                            openapi.Parameter(
                                "isArchived",
                                openapi.IN_QUERY,
                                type=openapi.TYPE_BOOLEAN,
                                description="Filter archived products (true or false)"
                            ),
                            openapi.Parameter(
                                "page",
                                openapi.IN_QUERY,
                                type=openapi.TYPE_INTEGER,
                                description="Page number for pagination"
                            ),
                            openapi.Parameter(
                                "page_size",
                                openapi.IN_QUERY,
                                type=openapi.TYPE_INTEGER,
                                description="Number of items per page (default: 9, max: 100)"
                            )
                         ],
                         responses={
                             200: openapi.Response('Success', openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'count': openapi.Schema(type=openapi.TYPE_INTEGER, description='Total number of items'),
                                     'hasNext': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Whether there is a next page'),
                                     'hasPrevious': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Whether there is a previous page'),
                                     'currentPage': openapi.Schema(type=openapi.TYPE_INTEGER, description='Current page number'),
                                     'results': openapi.Schema(
                                         type=openapi.TYPE_ARRAY,
                                         items=openapi.Schema(
                                             type=openapi.TYPE_OBJECT,
                                             properties={
                                                 'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                                 'name': openapi.Schema(type=openapi.TYPE_STRING),
                                                 'description': openapi.Schema(type=openapi.TYPE_STRING),
                                                 'price': openapi.Schema(type=openapi.TYPE_NUMBER),
                                                 'images': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                                                 'category': openapi.Schema(type=openapi.TYPE_OBJECT),
                                                 'sub_category': openapi.Schema(type=openapi.TYPE_OBJECT),
                                                 'pickup_location': openapi.Schema(type=openapi.TYPE_STRING),
                                                 'user': openapi.Schema(type=openapi.TYPE_OBJECT),
                                                 'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['pending', 'approved', 'rejected']),
                                                 'isArchived': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                                 'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                                                 'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time')
                                             }
                                         )
                                     )
                                 }
                             ))
                         })
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
    
    @action(
        detail=True,
        methods=['post'],
        permission_classes=[],  # No auth required
        url_path='archive-toggle',
        url_name='archive_toggle'
    )
    @swagger_auto_schema(
        tags=["Products"],
    
        operation_description="Archive or unarchive a product by setting isArchived to true or false",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['archive'],
            properties={
                'archive': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='True to archive, False to unarchive'),
            },
        ),
        responses={200: openapi.Response('Product archive status updated')}
    )
    def archive_toggle(self, request, pk=None):
        try:
            product = self.get_queryset().get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found or not owned by user"}, status=status.HTTP_404_NOT_FOUND)

        archive_flag = request.data.get('archive')
        if archive_flag is None:
            return Response({"detail": "'archive' field required (true or false)"}, status=status.HTTP_400_BAD_REQUEST)

        product.isArchived = bool(archive_flag)
        product.save()
        status_str = "archived" if product.isArchived else "unarchived"
        return Response({"detail": f"Product successfully {status_str}"}, status=status.HTTP_200_OK)
   

    
class CategoryViewSet(mixins.ListModelMixin, mixins.CreateModelMixin,
                      mixins.DestroyModelMixin, viewsets.GenericViewSet):
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
    
    @swagger_auto_schema(tags=["Categories"])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Categories"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class SubCategoryViewSet(mixins.ListModelMixin,  mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,viewsets.GenericViewSet):
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

    
    @swagger_auto_schema(tags=["SubCategories"])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["SubCategories"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)