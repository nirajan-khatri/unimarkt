from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SkillViewSet,UserViewSet,JobViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'users', UserViewSet , basename='user')
router.register(r'jobs', JobViewSet , basename='job')


urlpatterns = [
    path('', include(router.urls)),
]
