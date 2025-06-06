# models.py
from django.db import models
from uniMarktAuth.models import User

class ChatMessage(models.Model):
    text = models.TextField()
    sender_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    timestamp = models.DateTimeField(auto_now_add=True)
