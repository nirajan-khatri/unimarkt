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
from .serializers import SkillSerializer, SkillCreateSerializer


class SkillViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', 'get', 'delete', 'put']
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    filter_backends = [
        DjangoFilterBackend,
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
                                               description="product status - pending, approved,  rejected"),
                             openapi.Parameter(
                                                "isArchived",
                                                openapi.IN_QUERY,
                                                type=openapi.TYPE_BOOLEAN,
                                                description="Filter archived products (true or false)"
                                            )

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
