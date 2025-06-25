from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobCategoryViewSet  # updated import

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'job-categories', JobCategoryViewSet)  # updated route and viewset

urlpatterns = [
    path('', include(router.urls)),
]
