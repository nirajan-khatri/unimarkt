from django.contrib import admin
from .models import Department, Degree, Skill, AvailableTimeSlot

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(Degree)
class DegreeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'department']

