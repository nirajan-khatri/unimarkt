from rest_framework import serializers
from .models import Job, JobCategory  # renamed Department to JobCategory
from uniMarktAuth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']  # Add other fields as needed
        ref_name = 'JobUserSerializer'  # Unique name to avoid conflict

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name']
        ref_name = 'JobCategorySerializer'  # Unique name to avoid conflict

class JobSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested user object
    category = JobCategorySerializer(read_only=True)  # Nested category object
    category_id = serializers.PrimaryKeyRelatedField(queryset=JobCategory.objects.all(), source='category', write_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)

    class Meta:
        model = Job
        fields = [
            'job_id', 'title', 'location', 'status', 'isArchived', 'description',
            'qualifications', 'contact_email', 'salary_per_hour', 'created_at',
            'user', 'category', 'user_id', 'category_id',
        ]
