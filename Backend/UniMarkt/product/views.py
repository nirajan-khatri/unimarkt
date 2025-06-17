from drf_yasg import openapi
from rest_framework import viewsets, filters, mixins, status
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import  JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.authentication import JWTAuthentication

from .filters import ProductFilter
from .models import Product,Category,SubCategory
from .serializers import ProductSerializer, SubCategorySerializer, CategorySerializer, ProductCreateSerializer, \
    ProductUpdateSerializer


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Product.objects.filter()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    parser_classes = [JSONParser]
    
    def get_queryset(self):
        """
        Override get_queryset to filter out archived products from public view
        """
        queryset = super().get_queryset()
        
        # For list and retrieve actions
        if self.action in ['list', 'retrieve']:
            # If user is not authenticated, only show approved products
            if not self.request.user.is_authenticated:
                queryset = queryset.filter(status='approved')
            else:
                # Authenticated users see their own products (all statuses) and others' approved products
                queryset = queryset.filter(
                    Q(user=self.request.user) | 
                    Q(status='approved')
                )
        
        return queryset

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
                                               description="product status - pending, approved, archived, sold, rejected"),

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
        # When updating, set status back to pending for re-approval
        instance = self.get_object()
        if instance.user == request.user and instance.status == 'approved':
            request.data['status'] = 'pending'
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Products"])
    def destroy(self, request, *args, **kwargs):
        # Soft delete - mark as deleted instead of actually deleting
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to delete this product'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.status = 'deleted'
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], url_path='archive')
    @swagger_auto_schema(
        tags=["Products"],
        operation_description="Archive a product listing (makes it invisible to other users)",
        responses={
            200: openapi.Response(
                description="Product archived successfully",
                examples={
                    "application/json": {
                        "status": "Product archived successfully",
                        "product_id": 123,
                        "message": "Product is no longer visible in public listings"
                    }
                }
            )
        }
    )
    def archive(self, request, pk=None):
        """
        Archive a product listing.
        Only the product owner can archive their own products.
        """
        product = self.get_object()
        
        # Check if the user owns this product
        if product.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to archive this product'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if product is already archived
        if product.status == 'archived':
            return Response(
                {'error': 'Product is already archived'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Archive the product
        product.status = 'archived'
        product.save()
        
        serializer = self.get_serializer(product)
        
        return Response({
            'status': 'Product archived successfully',
            'product_id': product.product_id,
            'message': 'Product is no longer visible in public listings',
            'product': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path='unarchive')
    @swagger_auto_schema(
        tags=["Products"],
        operation_description="Unarchive a product listing (sets it to pending for re-approval)",
        responses={
            200: openapi.Response(
                description="Product unarchived successfully",
                examples={
                    "application/json": {
                        "status": "Product unarchived successfully",
                        "product_id": 123,
                        "message": "Product is now pending approval"
                    }
                }
            )
        }
    )
    def unarchive(self, request, pk=None):
        """
        Unarchive a product listing.
        Only the product owner can unarchive their own products.
        """
        product = self.get_object()
        
        # Check if the user owns this product
        if product.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to unarchive this product'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if product is actually archived
        if product.status != 'archived':
            return Response(
                {'error': 'Product is not archived'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Unarchive the product - set to pending for re-approval
        product.status = 'pending'
        product.save()
        
        serializer = self.get_serializer(product)
        
        return Response({
            'status': 'Product unarchived successfully',
            'product_id': product.product_id,
            'message': 'Product is now pending approval',
            'product': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='my-archived')
    @swagger_auto_schema(
        tags=["Products"],
        operation_description="Get all archived products for the current user"
    )
    def my_archived(self, request):
        """
        Get all archived products for the authenticated user.
        """
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        archived_products = Product.objects.filter(
            user=request.user,
            status='archived'
        ).order_by('-created_at')
        
        serializer = self.get_serializer(archived_products, many=True)
        return Response(serializer.data)
   

    
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

    @swagger_auto_schema(tags=["SubCategories"], manual_parameters=[openapi.Parameter("category_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=False, 
         description="Filter subcategories by category ID")])
    def list(self, request, *args, **kwargs):
        category_id = request.query_params.get("category_id")
        queryset = self.queryset

        if category_id:
            queryset = queryset.filter(category__id=category_id)

        serializer = self.get_serializer(queryset, many=True)
<<<<<<< feature/archiveproducts
        return Response(serializer.data)
=======
        return Response(serializer.data)

    
    @swagger_auto_schema(tags=["SubCategories"])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["SubCategories"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
>>>>>>> dev
