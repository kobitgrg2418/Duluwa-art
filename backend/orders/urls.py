from django.urls import path, include
from rest_framework.routers import DefaultRouter
from orders.views import OrderListView, OrderDetailView, OrderViewSet, CommissionInquiryView, CommissionInquiryViewSet

router = DefaultRouter()
router.register(r"", OrderViewSet, basename="order")

commission_router = DefaultRouter()
commission_router.register(r"", CommissionInquiryViewSet, basename="commission")

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),
    path("admin/", include(router.urls)),
    path("commission/", CommissionInquiryView.as_view(), name="commission-create"),
    path("commission/admin/", include(commission_router.urls)),
    path("<str:id>/", OrderDetailView.as_view(), name="order-detail"),
]