from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.admin_views import (
    AdminArtworkViewSet,
    AdminCollectionViewSet,
    AdminProcessStepViewSet,
    AdminTestimonialViewSet,
    AdminSiteMediaViewSet,
    AdminCommissionPricingViewSet,
    AdminUserViewSet,
    AdminOrderViewSet,
    AdminDashboardView,
)

router = DefaultRouter()
router.register(r"artworks", AdminArtworkViewSet, basename="admin-artwork")
router.register(r"collections", AdminCollectionViewSet, basename="admin-collection")
router.register(r"process", AdminProcessStepViewSet, basename="admin-process")
router.register(r"testimonials", AdminTestimonialViewSet, basename="admin-testimonial")
router.register(r"media", AdminSiteMediaViewSet, basename="admin-media")
router.register(r"commission-pricing", AdminCommissionPricingViewSet, basename="admin-commission-pricing")
router.register(r"users", AdminUserViewSet, basename="admin-user")
router.register(r"orders", AdminOrderViewSet, basename="admin-order")

urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("", include(router.urls)),
]