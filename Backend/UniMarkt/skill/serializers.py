from rest_framework import serializers
from .models import Department, Degree, AvailableTimeSlot, Skill
from uniMarktAuth.models import User
from uniMarktAuth.serializers import UserSerializer


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class DegreeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), source='department', write_only=True)
    class Meta:
        model = Degree
        fields = '__all__'


class AvailableTimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTimeSlot
        fields = ['day', 'start_time', 'end_time']

class SkillSerializer(serializers.ModelSerializer):
    available_time_week = AvailableTimeSlotSerializer(many=True)

    department_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), source='department', write_only=True)
    degree_id = serializers.PrimaryKeyRelatedField(queryset=Degree.objects.all(), source='degree', write_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)

    department = DepartmentSerializer(read_only=True)
    degree = DegreeSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Skill
        fields = [
            'skill_id', 'status', 'module', 'description', 'charge_per_hour',
            'department_id', 'degree_id', 'user_id', 'department', 'degree', 'user', 'available_time_week'
        ]

    def create(self, validated_data):
        time_data = validated_data.pop('available_time_week')
        skill = Skill.objects.create(**validated_data)
        for item in time_data:
            AvailableTimeSlot.objects.create(skill=skill, **item)
        return skill

    def update(self, instance, validated_data):
        times_data = validated_data.pop('available_time_week', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if times_data is not None:
            instance.available_time_week.all().delete()
            for time_data in times_data:
                AvailableTimeSlot.objects.create(skill=instance, **time_data)

        return instance



