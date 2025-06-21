from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters, mixins, status
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import SkillFilter
from .models import Skill, SkillCategory, Department, Degree
from .serializers import (
    SkillSerializer,
    SkillCreateSerializer,
    SkillCategorySerializer,
    DepartmentSerializer,
    DegreeSerializer,
)
from product.views import StandardResultsSetPagination


class SkillViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Skill.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = SkillFilter

    # choose one of these field names:
    ordering_fields = ['created_at', 'price', 'charge_per_hour']
    ordering = ['-created_at']

    parser_classes = [JSONParser]
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action == 'create':
            return SkillCreateSerializer
        if self.action == 'update':
            return SkillCreateSerializer
        return SkillSerializer

    @swagger_auto_schema(
        tags=["Skills"],
        request_body=SkillCreateSerializer,
        responses={201: SkillSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["Skills"],
        request_body=SkillCreateSerializer,
        responses={200: SkillSerializer}
    )
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["Skills"],
        operation_description=(
            "Filter skills by min-price, max-price, category name, sub-category name, "
            "module, description, status, user, archived flag; order by created_at or price; "
            "supports pagination"
        ),
        manual_parameters=[
            openapi.Parameter("price_min", openapi.IN_QUERY, type=openapi.TYPE_NUMBER, description="Min price"),
            openapi.Parameter("price_max", openapi.IN_QUERY, type=openapi.TYPE_NUMBER, description="Max price"),
            openapi.Parameter("skill_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Category name"),
            openapi.Parameter("sub_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Sub-category name"),
            openapi.Parameter("description", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Skill description search"),
            openapi.Parameter("module", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Module name"),
            openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Status (pending/approved/rejected)"),
            openapi.Parameter("user_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Filter by user ID"),
            openapi.Parameter("isArchived", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description="Archived flag"),
            openapi.Parameter("page", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Page number"),
            openapi.Parameter("page_size", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Items per page"),
        ],
        responses={
            200: openapi.Response(
                'Paginated skills list',
                openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'count': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'hasNext': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'hasPrevious': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'currentPage': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'results': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT)
                        )
                    }
                )
            )
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[],
        url_path='archive-toggle',
        url_name='archive_toggle'
    )
    @swagger_auto_schema(
        tags=["Skills"],
        operation_description="Archive/unarchive by setting isArchived flag",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['archive'],
            properties={'archive': openapi.Schema(type=openapi.TYPE_BOOLEAN)}
        ),
        responses={200: openapi.Response('Archive status updated')}
    )
    def archive_toggle(self, request, pk=None):
        try:
            skill = self.get_queryset().get(pk=pk)
        except Skill.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        flag = request.data.get('archive')
        if flag is None:
            return Response({"detail": "'archive' field required"}, status=status.HTTP_400_BAD_REQUEST)

        skill.isArchived = bool(flag)
        skill.save()
        status_str = "archived" if skill.isArchived else "unarchived"
        return Response({"detail": f"Skill {status_str}"}, status=status.HTTP_200_OK)


class SkillCategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer

    @swagger_auto_schema(
        tags=["Skill Categories"],
        manual_parameters=[
            openapi.Parameter("name", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by name")
        ]
    )
    def list(self, request, *args, **kwargs):
        name = request.query_params.get('name')
        qs = self.queryset.filter(name__icontains=name) if name else self.queryset
        if name and not qs.exists():
            return Response({'detail': f'No category named "{name}"'}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(qs, many=True).data)


class DepartmentViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @swagger_auto_schema(
        tags=["Departments"],
        manual_parameters=[
            openapi.Parameter("name", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by name")
        ]
    )
    def list(self, request, *args, **kwargs):
        name = request.query_params.get('name')
        qs = self.queryset.filter(name__icontains=name) if name else self.queryset
        return Response(self.get_serializer(qs, many=True).data)


class DegreeViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer

    @swagger_auto_schema(
        tags=["Degrees"],
        manual_parameters=[
            openapi.Parameter("department_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Filter by department")
        ]
    )
    def list(self, request, *args, **kwargs):
        dept = request.query_params.get("department_id")
        qs = self.queryset.filter(department__id=dept) if dept else self.queryset
        return Response(self.get_serializer(qs, many=True).data)
