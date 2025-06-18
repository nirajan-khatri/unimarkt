from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, SkillCategoryViewSet, DepartmentViewSet, DegreeViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'skill-categories', SkillCategoryViewSet, basename='skill-category')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'degrees', DegreeViewSet, basename='degree')

urlpatterns = [
    path('', include(router.urls)),
]