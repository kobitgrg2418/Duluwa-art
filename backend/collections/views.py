from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from django.db.models import Count

from backend.collections.models import Collection
from backend.collections.serializers import CollectionSerializer, CollectionListSerializer
from core.permissions import IsAdminUser


class CollectionListView(generics.ListAPIView):
    queryset = Collection.objects.annotate(artwork_count=Count("artworks")).all()
    serializer_class = CollectionListSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class CollectionDetailView(generics.RetrieveAPIView):
    queryset = Collection.objects.annotate(artwork_count=Count("artworks")).all()
    serializer_class = CollectionSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"