from rest_framework import serializers
from .models import Department, Degree, AvailableTimeSlot, Skill


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = '__all__'


class AvailableTimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTimeSlot
        fields = ['day', 'start_time', 'end_time']

class SkillSerializer(serializers.ModelSerializer):
    available_time_week = AvailableTimeSlotSerializer(many=True)

    class Meta:
        model = Skill
        fields = [
            'skill_id', 'status', 'module', 'description', 'charge_per_hour',
            'department', 'degree', 'user', 'available_time_week'
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



