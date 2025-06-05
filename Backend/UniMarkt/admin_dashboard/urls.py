from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SkillViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'skills', SkillViewSet, basename='skill')

urlpatterns = [
    path('', include(router.urls)),
]
