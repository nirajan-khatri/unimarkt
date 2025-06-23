from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.authentication import JWTAuthentication
from product.views import StandardResultsSetPagination

from .filters import JobPostingFilter
from .models import JobPosting
from .serializers import JobPostingSerializer, JobPostingCreateSerializer


class JobPostingViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    
    filterset_class = JobPostingFilter
    ordering_fields = ['created_at', 'remuneration']
    ordering = ['-created_at']
    
    parser_classes = [JSONParser]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """
        Override get_queryset to filter out archived jobs from public view
        """
        queryset = super().get_queryset()
        
        # For list and retrieve actions
        if self.action in ['list', 'retrieve']:
            # If user is not authenticated, only show approved jobs
            if not self.request.user.is_authenticated:
                queryset = queryset.filter(status='approved')
            else:
                # Authenticated users see their own jobs (all statuses) and others' approved jobs
                queryset = queryset.filter(
                    Q(posted_by=self.request.user) | 
                    Q(status='approved')
                )
        
        return queryset
    
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Filter job postings by department, job type, search in title/description. Supports pagination.",
        manual_parameters=[
            openapi.Parameter("department", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Filter by department ID"),
            openapi.Parameter("department__name", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by department name"),
            openapi.Parameter("job_type", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by job type (research, hiwi, tutoring, administrative, other)"),
            openapi.Parameter("title", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Search in job title"),
            openapi.Parameter("description", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Search in job description"),
            openapi.Parameter("status", openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Job status - pending, approved, archived, rejected"),
            openapi.Parameter("page", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Page number for pagination"),
            openapi.Parameter("page_size", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Number of items per page (default: 9, max: 100)")
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
                        items=openapi.Schema(type=openapi.TYPE_OBJECT)
                    )
                }
            ))
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(tags=["Job Postings"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @swagger_auto_schema(tags=["Job Postings"], request_body=JobPostingCreateSerializer)
    def create(self, request, *args, **kwargs):
        # Set the posted_by to current user
        serializer = JobPostingCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(tags=["Job Postings"], request_body=JobPostingCreateSerializer)
    def update(self, request, *args, **kwargs):
        # When updating, set status back to pending for re-approval
        instance = self.get_object()
        if instance.posted_by == request.user and instance.status == 'approved':
            request.data['status'] = 'pending'
        return super().update(request, *args, **kwargs)
    
    @swagger_auto_schema(tags=["Job Postings"])
    def destroy(self, request, *args, **kwargs):
        # Soft delete - mark as deleted instead of actually deleting
        instance = self.get_object()
        if instance.posted_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to delete this job posting'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.status = 'deleted'
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], url_path='archive')
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Archive a job posting (makes it invisible to other users)"
    )
    def archive(self, request, pk=None):
        """
        Archive a job posting.
        Only the job poster can archive their own jobs.
        """
        job_posting = self.get_object()
        
        # Check if the user owns this job posting
        if job_posting.posted_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to archive this job posting'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if job is already archived
        if job_posting.status == 'archived':
            return Response(
                {'error': 'Job posting is already archived'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Archive the job
        job_posting.status = 'archived'
        job_posting.save()
        
        serializer = self.get_serializer(job_posting)
        
        return Response({
            'status': 'Job posting archived successfully',
            'job_id': job_posting.job_id,
            'message': 'Job posting is no longer visible in public listings',
            'job_posting': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path='unarchive')
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Unarchive a job posting (sets it to pending for re-approval)"
    )
    def unarchive(self, request, pk=None):
        """
        Unarchive a job posting.
        Only the job poster can unarchive their own jobs.
        """
        job_posting = self.get_object()
        

        # Check if job is actually archived
        if job_posting.status != 'archived':
            return Response(
                {'error': 'Job posting is not archived'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Unarchive the job - set to pending for re-approval
        job_posting.status = 'pending'
        job_posting.save()
        
        serializer = self.get_serializer(job_posting)
        
        return Response({
            'status': 'Job posting unarchived successfully',
            'job_id': job_posting.job_id,
            'message': 'Job posting is now pending approval',
            'job_posting': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='my-archived')
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Get all archived job postings for the current user"
    )
    def my_archived(self, request):
        """
        Get all archived job postings for the authenticated user.
        """
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        archived_jobs = JobPosting.objects.filter(
            posted_by=request.user,
            status='archived'
        ).order_by('-created_at')
        
        serializer = self.get_serializer(archived_jobs, many=True)
        return Response(serializer.data)