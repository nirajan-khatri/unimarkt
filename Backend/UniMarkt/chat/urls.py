from django.urls import path
from .views import direct_chat

urlpatterns = [
    path('<int:sender_id>/<int:receiver_id>/', direct_chat, name='direct_chat'),
]
