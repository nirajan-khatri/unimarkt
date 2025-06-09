from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, direct_chat

router = DefaultRouter()
router.register(r'unique-users', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:sender_id>/<int:receiver_id>/', direct_chat, name='direct_chat'),
]
