from rest_framework import serializers
from uniMarktAuth.models import User


class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']