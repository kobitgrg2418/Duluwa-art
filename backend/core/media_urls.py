from django.urls import path
from core.views import SiteMediaListView, SiteMediaDetailView

urlpatterns = [
    path("", SiteMediaListView.as_view(), name="site-media-list"),
    path("<str:key>/", SiteMediaDetailView.as_view(), name="site-media-detail"),
]