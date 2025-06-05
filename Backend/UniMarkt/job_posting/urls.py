from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobPostingViewSet, AdminJobPostingViewSet

router = DefaultRouter()
router.register(r'job-postings', JobPostingViewSet, basename='job-posting')
router.register(r'admin/job-postings', AdminJobPostingViewSet, basename='admin-job-posting')

urlpatterns = [
    path('', include(router.urls)),
]