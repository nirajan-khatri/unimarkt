from django.urls import path
from .views import LoginAPIView, RegisterAPIView, RoleListView, SecurityQuestionChoiceView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path("roles/", RoleListView.as_view(), name="roles"),
    path("security-questions/", SecurityQuestionChoiceView.as_view(), name="security-questions"),
]