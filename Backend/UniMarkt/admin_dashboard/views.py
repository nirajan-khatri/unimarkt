from .filters import ProductFilter,SkillFilter,UserFilter
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets,  status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django_filters.rest_framework import DjangoFilterBackend

from product.models import Product
from skill.models import Skill
from uniMarktAuth.models import User,Role

from .serializers import (
    ProductSerializer,
    SkillSerializer,
    UserSerializer
)


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get',  'put', 'delete']
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [JSONParser]
    filterset_class = ProductFilter  # <--- this line enables filtering

    filter_backends = [DjangoFilterBackend]
    @swagger_auto_schema(tags=["admin_dashboard"],
                         operation_description="Filter products by status ",
                         manual_parameters=[
                             openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="product status - pending, approved, sold-out, rejected"),

                         ],
                         )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["admin_dashboard"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


    @swagger_auto_schema(request_body=ProductSerializer, tags=["admin_dashboard"])
    def update(self, request, *args, **kwargs):
        if 'status' not in request.data or len(request.data) > 1:
            return Response({'detail': 'Only status field can be updated.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["admin_dashboard"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class SkillViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'put', 'delete']
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    parser_classes = [JSONParser]
    
    filterset_class = SkillFilter  # THIS LINE is essential


    filter_backends = [DjangoFilterBackend]
    
    @swagger_auto_schema(tags=["admin_dashboard"],
                         operation_description="Filter skills by status ",
                         manual_parameters=[
                             openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="skill status - pending, approved, sold-out, rejected"),
                         ],
                         )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["admin_dashboard"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(request_body=SkillSerializer, tags=["admin_dashboard"])
    def update(self, request, *args, **kwargs):
        if 'status' not in request.data or len(request.data) > 1:
            return Response({'detail': 'Only status field can be updated.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["admin_dashboard"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(tags=["admin_dashboard"])
    def partial_update(self, request, *args, **kwargs):
        return Response({'detail': 'PATCH method not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def get_role_names():
    return [role.name for role in Role.objects.all()]

class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'put', 'delete']
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [JSONParser]

    filterset_class = UserFilter
    filter_backends = [DjangoFilterBackend]

    @swagger_auto_schema(
        tags=["admin_dashboard"],
        operation_description="Filter users by status flags.",
        manual_parameters=[
            openapi.Parameter("is_superuser", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description="Is the user a super user?"),
            openapi.Parameter("is_active", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description="Is the user active?"),
            openapi.Parameter("is_staff", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description="Is the user a staff member?"),
        ],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


    @swagger_auto_schema(request_body=UserSerializer, tags=["admin_dashboard"])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["admin_dashboard"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

 
