from rest_framework import serializers
from .models import JobPosting
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
    
    department = DepartmentSerializer(read_only=True)
    posted_by = UserSerializer(read_only=True)
    
    # Add archive-related fields like in products
    can_archive = serializers.SerializerMethodField()
    is_archived = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = JobPosting
        fields = [
            'job_id', 'title', 'description', 'qualifications', 
            'department', 'department_id', 'job_type', 'remuneration', 
            'contact_email', 'contact_name', 'contact_phone', 
            'status', 'status_display', 'posted_by', 
            'created_at', 'updated_at', 'rejection_reason',
            'can_archive', 'is_archived'
        ]
        read_only_fields = ['job_id', 'created_at', 'updated_at', 'posted_by', 'status_display']
    
    def get_can_archive(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.posted_by == request.user or request.user.is_staff
        return False
    
    def get_is_archived(self, obj):
        return obj.status == 'archived'


class JobPostingCreateSerializer(serializers.ModelSerializer):
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), 
        source='department'
    )
    
    class Meta:
        model = JobPosting
        fields = [
            'title', 'description', 'qualifications', 'department_id',
            'job_type', 'remuneration', 'contact_email', 'contact_name', 
            'contact_phone'
        ]