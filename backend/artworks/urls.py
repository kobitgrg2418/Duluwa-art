from django.urls import path, include
from rest_framework.routers import DefaultRouter
from artworks.views import (
    ArtworkListView,
    ArtworkDetailView,
    ArtworkViewSet,
    ProcessStepListView,
    ProcessStepViewSet,
    TestimonialListView,
    TestimonialViewSet,
)

router = DefaultRouter()
router.register(r"", ArtworkViewSet, basename="artwork")

process_router = DefaultRouter()
process_router.register(r"", ProcessStepViewSet, basename="process-step")

testimonial_router = DefaultRouter()
testimonial_router.register(r"", TestimonialViewSet, basename="testimonial")

urlpatterns = [
    path("", ArtworkListView.as_view(), name="artwork-list"),
    path("admin/", include(router.urls)),
    path("process/", ProcessStepListView.as_view(), name="process-list"),
    path("process/admin/", include(process_router.urls)),
    path("testimonials/", TestimonialListView.as_view(), name="testimonial-list"),
    path("testimonials/admin/", include(testimonial_router.urls)),
    path("<str:id>/", ArtworkDetailView.as_view(), name="artwork-detail"),
]