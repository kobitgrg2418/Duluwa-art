from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView, LogoutView, RegisterView, MeView, GoogleAuthView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/auth/google/", GoogleAuthView.as_view(), name="google_auth"),
    path("api/artworks/", include("artworks.urls")),
    path("api/collections/", include("backend.collections.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/users/", include("users.urls")),
    path("api/admin/", include("core.admin_urls")),
    path("api/process/", include("artworks.process_urls")),
    path("api/testimonials/", include("artworks.testimonial_urls")),
    path("api/site-media/", include("core.media_urls")),
    path("api/commission/", include("orders.commission_urls")),
    path("api/upload/", include("core.upload_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)