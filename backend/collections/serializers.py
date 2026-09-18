from rest_framework import serializers
from backend.collections.models import Collection
from artworks.models import Artwork
from artworks.serializers import ArtworkListSerializer


class CollectionSerializer(serializers.ModelSerializer):
    artworks = ArtworkListSerializer(many=True, read_only=True)
    artwork_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Collection
        fields = ["id", "no", "title", "count", "hue", "blurb", "cover", "artworks", "artwork_count", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class CollectionListSerializer(serializers.ModelSerializer):
    artwork_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Collection
        fields = ["id", "no", "title", "count", "hue", "blurb", "cover", "artwork_count"]