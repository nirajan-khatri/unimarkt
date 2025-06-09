from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from uniMarktAuth.models import User
from .models import ChatMessage
from .serializers import ChatUserSerializer


# --- Web UI View for Chat Lobby ---
def direct_chat(request, sender_id, receiver_id):
    return render(request, 'chat/lobby.html', {
        'sender_id': sender_id,
        'receiver_id': receiver_id,
    })


# --- API View for Unique Chat Users ---
class ChatViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]

    @swagger_auto_schema(
        tags=["chat"],
        operation_description="Get unique users a user has chatted with",
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER,
                              description="ID of the current user", required=True),
        ]
    )
    def list(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"detail": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)

        sent_to = ChatMessage.objects.filter(sender_id=user_id).values_list('receiver_id', flat=True)
        received_from = ChatMessage.objects.filter(receiver_id=user_id).values_list('sender_id', flat=True)

        unique_user_ids = set(sent_to).union(set(received_from))
        unique_user_ids.discard(user_id)

        users = User.objects.filter(id__in=unique_user_ids)
        serializer = ChatUserSerializer(users, many=True)
        return Response(serializer.data)
