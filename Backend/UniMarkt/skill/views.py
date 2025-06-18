from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .filters import SkillFilter
from .models import Skill
from .serializers import SkillSerializer, SkillCreateSerializer, SkillUpdateSerializer
from product.views import StandardResultsSetPagination


class SkillViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Skill.objects.filter()
    serializer_class = SkillSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

    filterset_class = SkillFilter
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    parser_classes = [JSONParser]

    def get_serializer_class(self):
        if self.action in ['update']:
            return SkillUpdateSerializer
        elif self.action == 'create':
            return SkillCreateSerializer
        return SkillSerializer

    @swagger_auto_schema(tags=["Skills"],
                         operation_description="Filter skills by min-price, max-price, category name, sub category name, description, status and order by created_at or price",
                         manual_parameters=[
                             openapi.Parameter("price_min", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by min price"),
                             openapi.Parameter("price_max", openapi.IN_QUERY, type=openapi.TYPE_NUMBER,
                                               description="Filter by max price"),
                             openapi.Parameter("skill_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by category name"),
                             openapi.Parameter("sub_category__name", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Filter by sub category name"),
                             openapi.Parameter("description", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search skill description"),
                             openapi.Parameter("module", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="Search by module name"),
                             openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING,
                                               description="skill status - pending, approved, rejected"), 
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
                                description="Filter archived skills (true or false)"
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
                                                 'description': openapi.Schema(type=openapi.TYPE_STRING),
                                                 'price': openapi.Schema(type=openapi.TYPE_NUMBER),
                                                 'module': openapi.Schema(type=openapi.TYPE_STRING),
                                                 'skill_category': openapi.Schema(type=openapi.TYPE_OBJECT),
                                                 'sub_category': openapi.Schema(type=openapi.TYPE_OBJECT),
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

    @swagger_auto_schema(tags=["Skills"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[], url_path='archive-toggle', url_name='archive_toggle')
    @swagger_auto_schema(
        tags=["Skills"],
        operation_description="Archive or unarchive a skill by setting isArchived to true or false",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['archive'],
            properties={'archive': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='True to archive, False to unarchive')}
        ),
        responses={200: openapi.Response('Skill archive status updated')}
    )
    def archive_toggle(self, request, pk=None):
        try:
            skill = self.get_queryset().get(pk=pk)
        except Skill.DoesNotExist:
            return Response({"detail": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)

        archive_flag = request.data.get('archive')
        if archive_flag is None:
            return Response({"detail": "'archive' field required (true or false)"}, status=status.HTTP_400_BAD_REQUEST)

        skill.isArchived = bool(archive_flag)
        skill.save()
        status_str = "archived" if skill.isArchived else "unarchived"
        return Response({"detail": f"Skill successfully {status_str}"}, status=status.HTTP_200_OK)
