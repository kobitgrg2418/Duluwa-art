from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q

from artworks.models import Artwork, ProcessStep, Testimonial
from artworks.serializers import (
    ArtworkSerializer,
    ArtworkListSerializer,
    ProcessStepSerializer,
    TestimonialSerializer,
)
from core.permissions import IsAdminUser


class ArtworkListView(generics.ListAPIView):
    queryset = Artwork.objects.select_related("collection").all()
    serializer_class = ArtworkListSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["collection", "status", "featured"]
    search_fields = ["title", "year", "medium"]
    ordering_fields = ["created_at", "price", "title"]
    ordering = ["-created_at"]
    pagination_class = None


class ArtworkDetailView(generics.RetrieveAPIView):
    queryset = Artwork.objects.select_related("collection").all()
    serializer_class = ArtworkSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.select_related("collection").all()
    serializer_class = ArtworkSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ["collection", "status", "featured"]
    search_fields = ["title", "year", "medium"]
    lookup_field = "id"

    @action(detail=False, methods=["post"])
    def batch_status(self, request):
        ids = request.data.get("ids", [])
        new_status = request.data.get("status")
        if not ids or new_status not in ["IN_SALE", "SOLD_OUT"]:
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        Artwork.objects.filter(id__in=ids).update(status=new_status)
        return Response({"ok": True})


class ProcessStepListView(generics.ListAPIView):
    queryset = ProcessStep.objects.all()
    serializer_class = ProcessStepSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ProcessStepViewSet(viewsets.ModelViewSet):
    queryset = ProcessStep.objects.all()
    serializer_class = ProcessStepSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "no"


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]