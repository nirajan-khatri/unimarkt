import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'theApp.settings')  
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import chat.routing


print("------------ASGI USED---------------")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(  # no AuthMiddlewareStack if no auth
        chat.routing.websocket_urlpatterns
    ),
})
