from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters
from rest_framework.parsers import JSONParser

from .filters import SkillFilter
from .models import Skill
from .serializers import SkillSerializer, SkillCreateSerializer


class SkillViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', 'get', 'delete', 'put']
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_class = SkillFilter
    ordering_fields = ['charge_per_hour', 'created_at']
    ordering = ['-created_at']

    parser_classes = [JSONParser]

    @swagger_auto_schema(tags=["Skills"], request_body=SkillCreateSerializer, responses={201: SkillSerializer})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"], request_body=SkillCreateSerializer, responses={201: SkillSerializer})
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"],
                         operation_description="Filter Skills by min-charge, max-charge, skill category name, module name, description, status and order by created_at or charge per hour",
                         manual_parameters=[
                             openapi.Parameter("price_min", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by min price"),
                             openapi.Parameter("price_max", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by max price"),
                             openapi.Parameter("skill_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by category name"),
                             openapi.Parameter("module", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by sub category name"),
                             openapi.Parameter("description", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search product description"),
                             openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="product status - pending, approved, sold-out, rejected"),

                         ],
                         )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)