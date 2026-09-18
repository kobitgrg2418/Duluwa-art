from rest_framework import serializers
from orders.models import Order, OrderItem, CommissionInquiry
from artworks.models import Artwork
from artworks.serializers import ArtworkListSerializer
from users.serializers import UserSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    artwork = ArtworkListSerializer(read_only=True)
    artwork_id = serializers.CharField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "artwork", "artwork_id", "qty", "price"]
        read_only_fields = ["id", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "status", "payment_method", "name", "email",
            "phone", "address", "city", "subtotal", "total", "items",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "subtotal", "total", "created_at", "updated_at"]


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "payment_method", "name", "email", "phone", "address", "city", "items",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        order = Order.objects.create(user=user, **validated_data)

        subtotal = 0
        for item_data in items_data:
            artwork = Artwork.objects.get(id=item_data["artwork_id"])
            price = artwork.price
            OrderItem.objects.create(order=order, artwork=artwork, qty=item_data["qty"], price=price)
            subtotal += price * item_data["qty"]

        order.subtotal = subtotal
        order.total = subtotal
        order.save()

        # Update artwork status to SOLD_OUT
        artwork_ids = [item["artwork_id"] for item in items_data]
        Artwork.objects.filter(id__in=artwork_ids).update(status="SOLD_OUT")

        return order


class AdminOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "status", "payment_method", "name", "email",
            "phone", "address", "city", "subtotal", "total", "items",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "subtotal", "total", "created_at", "updated_at"]


class CommissionInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionInquiry
        fields = [
            "id", "name", "email", "type", "size", "medium", "budget",
            "message", "ref_image", "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]


class AdminCommissionInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionInquiry
        fields = [
            "id", "name", "email", "type", "size", "medium", "budget",
            "message", "ref_image", "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]