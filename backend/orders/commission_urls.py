from django.urls import path, include
from orders.views import CommissionInquiryView, CommissionInquiryViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"", CommissionInquiryViewSet, basename="commission")

urlpatterns = [
    path("", CommissionInquiryView.as_view(), name="commission-create"),
    path("admin/", include(router.urls)),
]