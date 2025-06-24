from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import mixins

from .models import Job, JobCategory
from .serializers import JobSerializer, JobCategorySerializer
from product.views import StandardResultsSetPagination


class JobViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = Job.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at', 'salary_per_hour']
    ordering = ['-created_at']

    parser_classes = [JSONParser]
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        return JobSerializer

    @swagger_auto_schema(
        tags=["Jobs"],
        request_body=JobSerializer,
        responses={201: JobSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["Jobs"],
        request_body=JobSerializer,
        responses={200: JobSerializer}
    )
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["Jobs"],
        operation_description="Filter jobs by title, status, category, user, archived flag. Supports ordering and pagination.",
        manual_parameters=[
            openapi.Parameter("title", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Job title contains"),
            openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Job status"),
            openapi.Parameter("user_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="User ID"),
            openapi.Parameter("category_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Job Category ID"),
            openapi.Parameter("isArchived", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description="Archived flag"),
            openapi.Parameter("page", openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter("page_size", openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset

        title = request.query_params.get("title")
        if title:
            queryset = queryset.filter(title__icontains=title)

        status_param = request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        category_id = request.query_params.get("category_id")
        if category_id:
            queryset = queryset.filter(category__id=category_id)

        user_id = request.query_params.get("user_id")
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        is_archived = request.query_params.get("isArchived")
        if is_archived is not None:
            queryset = queryset.filter(isArchived=is_archived.lower() == 'true')

        self.queryset = queryset
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Jobs"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Jobs"])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True,
        methods=['post'],
        url_path='archive-toggle',
        url_name='archive_toggle'
    )
    @swagger_auto_schema(
        tags=["Jobs"],
        operation_description="Archive/unarchive a job by setting isArchived flag",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['archive'],
            properties={
                'archive': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }
        ),
        responses={200: openapi.Response('Archive status updated')}
    )
    def archive_toggle(self, request, pk=None):
        try:
            job = self.get_queryset().get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        flag = request.data.get('archive')
        if flag is None:
            return Response({"detail": "'archive' field is required"}, status=status.HTTP_400_BAD_REQUEST)

        job.isArchived = bool(flag)
        job.save()
        return Response({"detail": f"Job {'archived' if job.isArchived else 'unarchived'}"}, status=status.HTTP_200_OK)


class JobCategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer

    @swagger_auto_schema(
        tags=["Job Categories"],
        manual_parameters=[
            openapi.Parameter("name", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by name")
        ]
    )
    def list(self, request, *args, **kwargs):
        name = request.query_params.get('name')
        qs = self.queryset.filter(name__icontains=name) if name else self.queryset
        return Response(self.get_serializer(qs, many=True).data)
