import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = int(self.scope['url_route']['kwargs']['sender_id'])
        self.receiver_id = int(self.scope['url_route']['kwargs']['receiver_id'])


        # Create a unique group name for this chat pair (order doesn't matter)
        ids = sorted([self.sender_id, self.receiver_id])
        self.room_group_name = f'chat_{ids[0]}_{ids[1]}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": self.sender_id
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
        }))
