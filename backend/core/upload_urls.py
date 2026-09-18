from django.urls import path
from core.views import UploadView

urlpatterns = [
    path("", UploadView.as_view(), name="upload"),
]