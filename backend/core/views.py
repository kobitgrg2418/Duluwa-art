from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from django.core.files.storage import default_storage
import uuid

from core.permissions import IsAdminUser
from core.models import SiteMedia
from core.serializers import SiteMediaSerializer


class SiteMediaListView(generics.ListAPIView):
    queryset = SiteMedia.objects.all()
    serializer_class = SiteMediaSerializer
    permission_classes = []
    pagination_class = None


class SiteMediaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SiteMedia.objects.all()
    serializer_class = SiteMediaSerializer
    lookup_field = "key"
    permission_classes = [IsAdminUser]


class UploadView(generics.CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        ext = file.name.split(".")[-1].lower()
        filename = f"uploads/{uuid.uuid4()}.{ext}"
        path = default_storage.save(filename, file)
        url = request.build_absolute_uri(settings.MEDIA_URL + path)

        return Response({"url": url, "path": path})