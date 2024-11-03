import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from lockinstudylah.consumers import ChatConsumer  # Ensure this path is correct

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lockinstudylah.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(
                    [
                        path("ws/chat/", ChatConsumer.as_asgi()),
                    ]
                )
            )
        ),
    }
)
