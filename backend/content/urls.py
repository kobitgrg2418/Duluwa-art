from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from . import views as v

public = DefaultRouter()
public.register('artworks', v.ArtworkViewSet, basename='artwork')
public.register('collections', v.CollectionViewSet, basename='collection')
public.register('journal', v.JournalViewSet, basename='journal')

staff = DefaultRouter()
for prefix, vs in v.STAFF.items():
    staff.register(prefix, vs, basename=f'manage-{prefix}')

urlpatterns = [
    path('site/', v.SiteView.as_view()),
    path('home/', v.HomeView.as_view()),
    path('artist/', v.ArtistView.as_view()),
    path('shop-config/', v.ShopConfigView.as_view()),
    path('commissions/', v.CommissionCreate.as_view()),
    path('newsletter/', v.NewsletterCreate.as_view()),
    path('contact/', v.ContactCreate.as_view()),
    path('orders/', v.OrderCreate.as_view()),
    path('orders/<str:order_id>/', v.OrderLookup.as_view()),
    path('auth/token/', obtain_auth_token),
    path('manage/site-settings/', v.SiteStaffView.as_view()),
    path('manage/home/', v.HomeStaffView.as_view()),
    path('manage/artist/', v.ArtistStaffView.as_view()),
    path('manage/', include(staff.urls)),
    path('', include(public.urls)),
]
