from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAdminUser as DRFIsAdminUser
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta

from core.permissions import IsAdminUser
from artworks.models import Artwork, ProcessStep, Testimonial
from backend.collections.models import Collection
from core.models import SiteMedia, CommissionPricing
from orders.models import Order, OrderItem
from users.models import User
from artworks.serializers import ArtworkSerializer, ProcessStepSerializer, TestimonialSerializer
from backend.collections.serializers import CollectionSerializer
from core.serializers import SiteMediaSerializer, CommissionPricingSerializer
from users.serializers import UserSerializer, AdminUserSerializer
from orders.serializers import OrderSerializer, AdminOrderSerializer


class SiteMediaListView(generics.ListAPIView):
    queryset = SiteMedia.objects.all()
    serializer_class = SiteMediaSerializer
    permission_classes = []


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

        from django.core.files.storage import default_storage
        from django.conf import settings
        import uuid

        ext = file.name.split(".")[-1].lower()
        filename = f"uploads/{uuid.uuid4()}.{ext}"
        path = default_storage.save(filename, file)
        url = request.build_absolute_uri(settings.MEDIA_URL + path)

        return Response({"url": url, "path": path})


class AdminDashboardView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        last_30_days = now - timedelta(days=30)

        stats = {
            "total_users": User.objects.count(),
            "total_artworks": Artwork.objects.count(),
            "total_collections": Collection.objects.count(),
            "total_orders": Order.objects.count(),
            "pending_orders": Order.objects.filter(status="pending").count(),
            "total_revenue": Order.objects.filter(status__in=["paid", "shipped", "delivered"]).aggregate(
                total=Sum("total")
            )["total"] or 0,
            "recent_orders": Order.objects.select_related("user").order_by("-created_at")[:5].values(
                "id", "user__name", "total", "status", "created_at"
            ),
            "top_artworks": Artwork.objects.annotate(
                order_count=Count("orderitem")
            ).order_by("-order_count")[:5].values("id", "title", "order_count"),
        }

        return Response(stats)


class AdminArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.select_related("collection").all()
    serializer_class = ArtworkSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ["collection", "status", "featured"]
    search_fields = ["title", "year", "medium"]

    @action(detail=False, methods=["post"])
    def batch_status(self, request):
        ids = request.data.get("ids", [])
        new_status = request.data.get("status")
        if not ids or new_status not in ["IN_SALE", "SOLD_OUT"]:
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        Artwork.objects.filter(id__in=ids).update(status=new_status)
        return Response({"ok": True})


class AdminCollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminUser]
    search_fields = ["title", "no"]


class AdminProcessStepViewSet(viewsets.ModelViewSet):
    queryset = ProcessStep.objects.all()
    serializer_class = ProcessStepSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "no"


class AdminTestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]


class AdminSiteMediaViewSet(viewsets.ModelViewSet):
    queryset = SiteMedia.objects.all()
    serializer_class = SiteMediaSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "key"


class AdminCommissionPricingViewSet(viewsets.ModelViewSet):
    queryset = CommissionPricing.objects.all()
    serializer_class = CommissionPricingSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CommissionPricing.objects.prefetch_related("tiers").all()


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    filterset_fields = ["role"]
    search_fields = ["name", "email"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return AdminUserSerializer
        return UserSerializer

    @action(detail=True, methods=["patch"])
    def role(self, request, pk=None):
        user = self.get_object()
        role = request.data.get("role")
        if role not in ["admin", "user"]:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        user.save()
        return Response({"ok": True})


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("items__artwork").all()
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ["status"]
    search_fields = ["id", "user__name", "user__email"]

    @action(detail=True, methods=["patch"])
    def status(self, request, pk=None):
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
            from orders.tasks import send_payment_confirmation
            send_payment_confirmation.delay(order.id)

        return Response({"ok": True})