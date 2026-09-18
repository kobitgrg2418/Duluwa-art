import os
import sys

from django.core.servers.basehttp import run
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "duluwa_backend.settings")
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

application = get_wsgi_application()
run(
    "127.0.0.1",
    int(os.environ.get("PORT", "8000")),
    application,
    threading=True,
)
