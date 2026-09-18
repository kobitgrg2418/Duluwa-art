from rest_framework import serializers
from artworks.models import Artwork, ProcessStep, Testimonial
from backend.collections.models import Collection


class CollectionSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "no", "title", "hue", "cover"]


class ArtworkSerializer(serializers.ModelSerializer):
    collection = CollectionSimpleSerializer(read_only=True)
    collection_id = serializers.CharField(write_only=True, required=False, source="collection.id")

    class Meta:
        model = Artwork
        fields = [
            "id", "title", "year", "medium", "size", "collection", "collection_id",
            "hue", "ratio", "featured", "note", "image", "video", "price", "status",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_collection_id(self, value):
        if value and not Collection.objects.filter(id=value).exists():
            raise serializers.ValidationError("Collection not found.")
        return value


class ArtworkListSerializer(serializers.ModelSerializer):
    collection = CollectionSimpleSerializer(read_only=True)

    class Meta:
        model = Artwork
        fields = [
            "id", "title", "year", "medium", "size", "collection",
            "hue", "ratio", "featured", "note", "image", "video", "price", "status",
        ]


class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = ["no", "title", "hue", "text"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "quote", "who", "role", "created_at"]
        read_only_fields = ["id", "created_at"]