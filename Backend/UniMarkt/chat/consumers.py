import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = int(self.scope['url_route']['kwargs']['sender_id'])
        self.receiver_id = int(self.scope['url_route']['kwargs']['receiver_id'])

        # Create a unique group name
        ids = sorted([self.sender_id, self.receiver_id])
        self.room_group_name = f'chat_{ids[0]}_{ids[1]}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send previous messages
        messages = await self.get_last_messages(self.room_group_name)
        for msg in messages:
            await self.send(text_data=json.dumps({
                'message': msg["text"],
                'sender_id': msg["sender_id"],
                'receiver_id': msg["receiver_id"],
                'timestamp': msg["timestamp"]
            }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        # Save to DB
        await self.save_message(message, self.sender_id, self.receiver_id)

        # Broadcast to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": self.sender_id,
                "receiver_id": self.receiver_id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "receiver_id": event["receiver_id"],
        }))

    @database_sync_to_async
    def save_message(self, message, sender_id, receiver_id):
        ChatMessage.objects.create(text=message, sender_id_id=sender_id, receiver_id_id=receiver_id)

    @database_sync_to_async
    def get_last_messages(self, room_group_name, limit=50):
        _, id1, id2 = room_group_name.split('_')
        id1, id2 = int(id1), int(id2)
        messages = ChatMessage.objects.filter(
            sender_id__in=[id1, id2],
            receiver_id__in=[id1, id2]
        ).order_by('-timestamp')[:limit]

        return [
            {
                "text": msg.text,
                "sender_id": msg.sender_id_id,
                "receiver_id": msg.receiver_id_id,
                "timestamp": msg.timestamp.isoformat()
            } for msg in reversed(messages)
        ]
