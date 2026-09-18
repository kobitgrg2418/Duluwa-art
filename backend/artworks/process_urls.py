from django.urls import include, path
from artworks.views import ProcessStepListView, ProcessStepViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"", ProcessStepViewSet, basename="process-step")

urlpatterns = [
    path("", ProcessStepListView.as_view(), name="process-list"),
    path("admin/", include(router.urls)),
]