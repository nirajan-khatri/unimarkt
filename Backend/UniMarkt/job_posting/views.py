from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .filters import JobPostingFilter
from .models import JobPosting, JobApplication
from .serializers import (
    JobPostingSerializer, 
    JobPostingCreateSerializer, 
    JobPostingListSerializer,
    JobApplicationSerializer
)


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobPostingFilter
    search_fields = ['title', 'description', 'qualifications']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    parser_classes = [JSONParser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return JobPostingListSerializer
        elif self.action == 'create':
            return JobPostingCreateSerializer
        return JobPostingSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter out deleted jobs for normal users
        if not self.request.user.is_staff:
            queryset = queryset.exclude(status='deleted')
        
        # Faculty can see their own jobs regardless of status
        if self.action in ['update', 'destroy', 'archive', 'unarchive']:
            queryset = queryset.filter(posted_by=self.request.user)
        
        # Public can only see approved jobs
        elif not self.request.user.is_authenticated:
            queryset = queryset.filter(status='approved')
        
        return queryset
    
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Create a new job posting (Faculty only)",
        request_body=JobPostingCreateSerializer,
        responses={201: JobPostingSerializer}
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return full serializer for response
        response_serializer = JobPostingSerializer(serializer.instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Update job posting (sets status to pending)",
        request_body=JobPostingCreateSerializer,
        responses={200: JobPostingSerializer}
    )
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Set status to pending when editing
        request.data['status'] = 'pending'
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Filter jobs by department, search by title/description/qualifications"
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(tags=["Job Postings"])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Delete job posting (marks as deleted, not visible to public)"
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'deleted'
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Archive a job posting (Faculty only)"
    )
    def archive(self, request, pk=None):
        job_posting = self.get_object()
        job_posting.status = 'archived'
        job_posting.save()
        return Response({'status': 'Job posting archived'})
    
    @action(detail=True, methods=['post'])
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Unarchive a job posting (Faculty only)"
    )
    def unarchive(self, request, pk=None):
        job_posting = self.get_object()
        job_posting.status = 'pending'  # Goes back to pending for approval
        job_posting.save()
        return Response({'status': 'Job posting unarchived and set to pending'})
    
    @action(detail=False, methods=['get'])
    @swagger_auto_schema(
        tags=["Job Postings"],
        operation_description="Get all active job postings"
    )
    def active(self, request):
        active_jobs = self.get_queryset().filter(status='approved')
        serializer = self.get_serializer(active_jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser])
    @swagger_auto_schema(
        tags=["Job Applications"],
        operation_description="Apply for a job posting",
        request_body=JobApplicationSerializer,
        responses={201: JobApplicationSerializer}
    )
    def apply(self, request, pk=None):
        job_posting = self.get_object()
        
        # Check if user already applied
        if JobApplication.objects.filter(
            job_posting=job_posting,
            applicant=request.user
        ).exists():
            return Response(
                {'error': 'You have already applied for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = JobApplicationSerializer(
            data={
                'job_posting_id': job_posting.job_id,
                'resume_file': request.FILES.get('resume_file'),
                'cover_letter': request.data.get('cover_letter')
            },
            context={'request': request}
        )
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    @swagger_auto_schema(
        tags=["Job Applications"],
        operation_description="Get all applications for a job posting (Faculty only)"
    )
    def applications(self, request, pk=None):
        job_posting = self.get_object()
        
        # Only the poster can see applications
        if job_posting.posted_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to view these applications'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        applications = job_posting.applications.all()
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class AdminJobPostingViewSet(viewsets.ModelViewSet):
    """Admin-only viewset for job posting management"""
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    
    @action(detail=True, methods=['post'])
    @swagger_auto_schema(
        tags=["Admin Job Management"],
        operation_description="Approve a job posting",
        responses={200: JobPostingSerializer}
    )
    def approve(self, request, pk=None):
        job_posting = self.get_object()
        job_posting.status = 'approved'
        job_posting.rejection_reason = None
        job_posting.save()
        return Response({'status': 'Job posting approved'})
    
    @action(detail=True, methods=['post'])
    @swagger_auto_schema(
        tags=["Admin Job Management"],
        operation_description="Reject a job posting",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'reason': openapi.Schema(type=openapi.TYPE_STRING, description='Rejection reason')
            }
        ),
        responses={200: JobPostingSerializer}
    )
    def reject(self, request, pk=None):
        job_posting = self.get_object()
        job_posting.status = 'rejected'
        job_posting.rejection_reason = request.data.get('reason', '')
        job_posting.save()
        return Response({'status': 'Job posting rejected', 'reason': job_posting.rejection_reason})