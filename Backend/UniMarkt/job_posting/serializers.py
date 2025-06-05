from rest_framework import serializers
from .models import JobPosting, JobApplication
from skill.models import Department
from skill.serializers import DepartmentSerializer
from uniMarktAuth.models import User
from uniMarktAuth.serializers import UserSerializer


class JobPostingSerializer(serializers.ModelSerializer):
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), 
        source='department', 
        write_only=True
    )
    posted_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='posted_by', 
        write_only=True
    )
    
    department = DepartmentSerializer(read_only=True)
    posted_by = UserSerializer(read_only=True)
    application_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobPosting
        fields = [
            'job_id', 'title', 'description', 'qualifications', 'department_id',
            'job_type', 'remuneration', 'contact_email', 'contact_name', 
            'contact_phone', 'status', 'posted_by_id', 'department', 'posted_by',
            'application_count', 'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['job_id', 'created_at', 'updated_at', 'application_count']
    
    def get_application_count(self, obj):
        return obj.applications.count()


class JobPostingCreateSerializer(serializers.ModelSerializer):
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), 
        source='department', 
        write_only=True
    )
    
    class Meta:
        model = JobPosting
        fields = [
            'title', 'description', 'qualifications', 'department_id',
            'job_type', 'remuneration', 'contact_email', 'contact_name', 
            'contact_phone'
        ]
    
    def create(self, validated_data):
        # Add the current user as posted_by from the request context
        validated_data['posted_by'] = self.context['request'].user
        return super().create(validated_data)


class JobApplicationSerializer(serializers.ModelSerializer):
    job_posting = JobPostingSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)
    job_posting_id = serializers.PrimaryKeyRelatedField(
        queryset=JobPosting.objects.all(),
        source='job_posting',
        write_only=True
    )
    
    class Meta:
        model = JobApplication
        fields = [
            'application_id', 'job_posting_id', 'job_posting', 'applicant',
            'resume_file', 'cover_letter', 'status', 'applied_at'
        ]
        read_only_fields = ['application_id', 'applicant', 'applied_at', 'status']
    
    def create(self, validated_data):
        # Add the current user as applicant from the request context
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate_resume_file(self, value):
        # Validate file is PDF and under 5MB
        if not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Resume must be a PDF file.")
        if value.size > 5 * 1024 * 1024:  # 5MB
            raise serializers.ValidationError("Resume file size must be under 5MB.")
        return value


class JobPostingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    posted_by_name = serializers.CharField(source='posted_by.get_full_name', read_only=True)
    
    class Meta:
        model = JobPosting
        fields = [
            'job_id', 'title', 'department_name', 'job_type', 'remuneration',
            'posted_by_name', 'created_at', 'status'
        ]