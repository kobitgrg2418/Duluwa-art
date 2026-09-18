from django.urls import path, include
from artworks.views import TestimonialListView, TestimonialViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"", TestimonialViewSet, basename="testimonial")

urlpatterns = [
    path("", TestimonialListView.as_view(), name="testimonial-list"),
    path("admin/", include(router.urls)),
]