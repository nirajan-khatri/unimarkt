from django.contrib import admin
from .models import Department, Degree, Skill, AvailableTimeSlot, SkillCategory


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(Degree)
class DegreeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'department']

@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(AvailableTimeSlot)
class AvailableTimeSlotAdmin(admin.ModelAdmin):
    list_display = ['id', 'day', 'start_time', 'end_time', 'status', 'skill']