from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.collections.views import CollectionListView, CollectionDetailView, CollectionViewSet

router = DefaultRouter()
router.register(r"", CollectionViewSet, basename="collection")

urlpatterns = [
    path("", CollectionListView.as_view(), name="collection-list"),
    path("admin/", include(router.urls)),
    path("<str:id>/", CollectionDetailView.as_view(), name="collection-detail"),
]