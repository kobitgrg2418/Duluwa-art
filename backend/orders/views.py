from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.conf import settings

from orders.models import Order, OrderItem, CommissionInquiry
from orders.serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    AdminOrderSerializer,
    CommissionInquirySerializer,
    AdminCommissionInquirySerializer,
)
from artworks.models import Artwork
from core.permissions import IsAdminUser, IsOwnerOrAdmin
from core.tasks import send_payment_confirmation


class OrderListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related("user").prefetch_related("items__artwork")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return OrderCreateSerializer
        return OrderSerializer


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_field = "id"

    def get_queryset(self):
        return Order.objects.select_related("user").prefetch_related("items__artwork")


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("items__artwork").all()
    permission_classes = [IsAdminUser]
    filterset_fields = ["status"]
    search_fields = ["id", "user__name", "user__email"]
    lookup_field = "id"

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return AdminOrderSerializer
        return AdminOrderSerializer

    @action(detail=True, methods=["patch"])
    def status(self, request, id=None):
        order = self.get_object()
        new_status = request.data.get("status")
        valid_statuses = ["pending", "paid", "shipped", "delivered", "cancelled"]
        if new_status not in valid_statuses:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        old_status = order.status
        order.status = new_status
        order.save()

        if new_status == "paid" and old_status != "paid":
            artwork_ids = order.items.values_list("artwork_id", flat=True)
            Artwork.objects.filter(id__in=artwork_ids).update(status="SOLD_OUT")
            send_payment_confirmation.delay(order.id)

        return Response({"ok": True})


class CommissionInquiryView(generics.CreateAPIView):
    queryset = CommissionInquiry.objects.all()
    serializer_class = CommissionInquirySerializer
    permission_classes = [AllowAny]


class CommissionInquiryViewSet(viewsets.ModelViewSet):
    queryset = CommissionInquiry.objects.all()
    serializer_class = AdminCommissionInquirySerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ["status", "type"]
    search_fields = ["name", "email"]