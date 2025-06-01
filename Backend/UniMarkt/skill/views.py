from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters
from .models import Skill
from .serializers import SkillSerializer


class SkillViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', 'get', 'delete']
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'status', 'user__email', 'department__name', 'degree__name']
    ordering_fields = ['charge_per_hour', 'created_at']

    @swagger_auto_schema(tags=["Skills"])
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Skills"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)