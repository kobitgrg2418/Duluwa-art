import django_filters as df
from django.db.models import Q
from django.http import Http404
from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from . import models as m
from . import serializers as s


class Pager(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 500


class SubmitThrottle(AnonRateThrottle):
    scope = 'submit'


# ------------------------------------------------------------------ public read
class ArtworkFilter(df.FilterSet):
    series = df.CharFilter(field_name='series__slug')
    max_price = df.NumberFilter(field_name='price_npr', lookup_expr='lte')
    min_price = df.NumberFilter(field_name='price_npr', lookup_expr='gte')
    orientation = df.CharFilter(method='by_orientation')
    saved = df.CharFilter(method='by_saved', help_text='Comma separated slugs (wishlist).')

    class Meta:
        model = m.Artwork
        fields = ['type', 'status', 'category', 'just_painted', 'one_of_one', 'year']

    def by_orientation(self, qs, name, value):
        from django.db.models import F
        if value == 'landscape':
            return qs.filter(width_px__gte=F('height_px'))
        if value == 'portrait':
            return qs.filter(width_px__lt=F('height_px'))
        return qs

    def by_saved(self, qs, name, value):
        return qs.filter(slug__in=[v for v in value.split(',') if v])


class ArtworkViewSet(viewsets.ReadOnlyModelViewSet):
    """Public catalogue. Filters: type, status, series, category, orientation, just_painted, min_price, max_price, saved, search."""
    lookup_field = 'slug'
    pagination_class = Pager
    filterset_class = ArtworkFilter
    search_fields = ['title', 'tags', 'description', 'series__title']
    ordering_fields = ['order', 'price_npr', 'year', 'created_at', 'title']

    def get_queryset(self):
        return m.Artwork.objects.filter(is_published=True).select_related('series').prefetch_related('gallery')

    def get_serializer_class(self):
        return s.ArtworkDetailSerializer if self.action == 'retrieve' else s.ArtworkListSerializer


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    pagination_class = None
    filter_backends = []

    def get_queryset(self):
        return m.Collection.objects.filter(is_published=True)

    def get_serializer_class(self):
        return s.CollectionDetailSerializer if self.action == 'retrieve' else s.CollectionSerializer


class JournalViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    pagination_class = Pager
    serializer_class = s.JournalSerializer
    queryset = m.JournalPost.objects.filter(is_published=True)
    filterset_fields = ['tag']
    search_fields = ['title', 'body']


class SiteView(APIView):
    """Global settings, header/footer meta, menu links and the marquee strip."""
    def get(self, request):
        cfg = m.SiteSettings.load()
        data = s.SiteSettingsSerializer(cfg, context={'request': request}).data
        data['menu_links'] = s.MenuLinkSerializer(m.MenuLink.objects.filter(is_published=True), many=True).data
        data['marquee'] = list(m.MarqueeItem.objects.filter(is_published=True).values_list('text', flat=True))
        return Response(data)


class HomeView(APIView):
    """Everything the home page needs in one request."""
    def get(self, request):
        ctx = {'request': request}
        home = m.HomePage.load()
        art = lambda a: s.ArtworkListSerializer(a, context=ctx).data if a else None  # noqa: E731
        pub = m.Artwork.objects.filter(is_published=True).select_related('series')
        many = lambda qs: s.ArtworkListSerializer(qs, many=True, context=ctx).data  # noqa: E731
        originals = pub.filter(type='original', status='available')
        prints = pub.filter(type='print')
        just = pub.filter(just_painted=True)
        return Response({
            'hero': {
                'lines': home.hero_line_list,
                'scroll_hint': home.scroll_hint,
                'tagline': m.SiteSettings.load().tagline,
                'finale_artwork': art(home.hero_finale_artwork),
                'layers': [{'artwork': art(l.artwork), 'left_vw': l.left_vw, 'width_vw': l.width_vw, 'start_vh': l.start_vh,
                            'speed': l.speed, 'show_on_mobile': l.show_on_mobile} for l in home.hero_layers.select_related('artwork__series')],
            },
            'shop': {
                'title': [home.shop_title_line1, home.shop_title_line2],
                'originals': {'label': home.originals_label, 'count': originals.count(), 'items': many(originals[:5])},
                'prints': {'label': home.prints_label, 'count': prints.count(), 'items': many(prints[:5])},
                'just_painted': {'label': home.just_painted_label, 'count': just.count(), 'items': many(just[:3])},
            },
            'care': {
                'heading': home.care_heading, 'text': home.care_text,
                'primary': {'label': home.care_primary_label, 'href': home.care_primary_href},
                'secondary': {'label': home.care_secondary_label, 'href': home.care_secondary_href},
                'tiles': [{'label': t.label, 'value': t.value, 'sub': t.sub} for t in home.info_tiles.all()],
                'tall_artwork': art(home.care_tall_artwork), 'wide_artwork': art(home.care_wide_artwork),
            },
            'series': {'heading': home.series_heading,
                       'items': s.CollectionSerializer(m.Collection.objects.filter(is_published=True), many=True, context=ctx).data},
            'cta_panels': [{'title': c.title, 'note': c.note, 'button_label': c.button_label, 'href': c.href, 'background': c.background}
                           for c in home.cta_panels.all()],
            'quote': {'text': home.quote_text, 'author': home.quote_author, 'artwork': art(home.quote_artwork)},
            'footer_fan': [art(f.artwork) for f in home.fan_cards.select_related('artwork__series')],
        })


class ArtistView(APIView):
    def get(self, request):
        return Response(s.ArtistSerializer(m.ArtistProfile.load(), context={'request': request}).data)


class ShopConfigView(APIView):
    """Print sizes/papers and shipping methods used to price the cart."""
    def get(self, request):
        return Response({
            'print_sizes': s.PrintSizeSerializer(m.PrintSize.objects.all(), many=True).data,
            'print_papers': s.PrintPaperSerializer(m.PrintPaper.objects.all(), many=True).data,
            'shipping_methods': s.ShippingSerializer(m.ShippingMethod.objects.filter(is_published=True), many=True).data,
            'npr_per_usd': float(m.SiteSettings.load().npr_per_usd),
        })


# ------------------------------------------------------------------ public write
class _Create(generics.CreateAPIView):
    throttle_classes = [SubmitThrottle]
    permission_classes = [permissions.AllowAny]


class CommissionCreate(_Create):
    serializer_class = s.CommissionCreateSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class NewsletterCreate(_Create):
    serializer_class = s.NewsletterSerializer

    def create(self, request, *a, **kw):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response({'ok': True, 'message': m.SiteSettings.load().newsletter_thanks}, status=status.HTTP_201_CREATED)


class ContactCreate(_Create):
    serializer_class = s.ContactSerializer


class OrderCreate(_Create):
    serializer_class = s.OrderCreateSerializer

    def create(self, request, *a, **kw):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        order = ser.save()
        return Response(s.OrderOutSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderLookup(APIView):
    """GET /api/orders/DA-XXXXXX/?email=you@example.com"""
    throttle_classes = [SubmitThrottle]

    def get(self, request, order_id):
        email = request.query_params.get('email', '').lower()
        try:
            order = m.Order.objects.get(order_id=order_id, email__iexact=email)
        except m.Order.DoesNotExist:
            raise Http404
        return Response(s.OrderOutSerializer(order).data)


# ------------------------------------------------------------------ staff CRUD
class StaffOnly(permissions.IsAdminUser):
    pass


def staff_viewset(model, qs=None, search=(), filters=(), serializer=None):
    ser = serializer or s.model_serializer(model)
    attrs = {
        'queryset': qs if qs is not None else model.objects.all(),
        'serializer_class': ser,
        'permission_classes': [StaffOnly],
        'parser_classes': [MultiPartParser, FormParser, JSONParser],
        'pagination_class': Pager,
        'search_fields': list(search),
        'filterset_fields': list(filters),
        'throttle_classes': [],
    }
    return type(f'{model.__name__}StaffViewSet', (viewsets.ModelViewSet,), attrs)


class StaffArtworkSerializer(s.model_serializer(m.Artwork)):
    class Meta:
        model = m.Artwork
        exclude = ['width_px', 'height_px', 'blur_data_url', 'rendition_480', 'rendition_960', 'rendition_1600']
        extra_kwargs = {'slug': {'required': False}, 'image': {'required': False}}


class SingletonStaffView(APIView):
    """GET / PATCH the one record (site settings, home page, artist profile)."""
    permission_classes = [StaffOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    model = None
    serializer_class = None

    def get(self, request):
        return Response(self.serializer_class(self.model.load(), context={'request': request}).data)

    def patch(self, request):
        ser = self.serializer_class(self.model.load(), data=request.data, partial=True, context={'request': request})
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

    put = patch


def singleton_view(model, serializer):
    return type(f'{model.__name__}StaffView', (SingletonStaffView,), {'model': model, 'serializer_class': serializer})


class OrderStaffSerializer(s.model_serializer(m.Order, items=s.OrderItemOutSerializer(many=True, read_only=True))):
    class Meta:
        model = m.Order
        fields = '__all__'
        read_only_fields = ['order_id', 'subtotal_npr', 'shipping_npr', 'total_npr']


from rest_framework import serializers as _ser  # noqa: E402


class _RefSer(_ser.ModelSerializer):
    class Meta:
        model = m.CommissionReference
        fields = ['id', 'image']


class CommissionStaffSerializer(s.StaffModelSerializer):
    references = _RefSer(many=True, read_only=True)

    class Meta:
        model = m.CommissionRequest
        fields = '__all__'


HomeStaffView = singleton_view(m.HomePage, s.model_serializer(m.HomePage))
SiteStaffView = singleton_view(m.SiteSettings, s.model_serializer(m.SiteSettings))
ArtistStaffView = singleton_view(m.ArtistProfile, s.model_serializer(m.ArtistProfile))

STAFF = {
    'artworks': staff_viewset(m.Artwork, m.Artwork.objects.select_related('series'), ('title', 'tags'), ('type', 'status', 'series', 'is_published'), StaffArtworkSerializer),
    'artwork-images': staff_viewset(m.ArtworkImage, filters=('artwork',)),
    'collections': staff_viewset(m.Collection),
    'journal': staff_viewset(m.JournalPost, search=('title',)),
    'marquee': staff_viewset(m.MarqueeItem),
    'menu-links': staff_viewset(m.MenuLink),
    'print-sizes': staff_viewset(m.PrintSize),
    'print-papers': staff_viewset(m.PrintPaper),
    'shipping-methods': staff_viewset(m.ShippingMethod),
    'hero-layers': staff_viewset(m.HeroLayer),
    'info-tiles': staff_viewset(m.InfoTile),
    'cta-panels': staff_viewset(m.CTAPanel),
    'fan-cards': staff_viewset(m.FooterFanCard),
    'process-stages': staff_viewset(m.ProcessStage),
    'commissions': staff_viewset(m.CommissionRequest, search=('name', 'email'), filters=('status',), serializer=CommissionStaffSerializer),
    'subscribers': staff_viewset(m.NewsletterSubscriber, search=('email',)),
    'messages': staff_viewset(m.ContactMessage, filters=('is_read',)),
    'orders': staff_viewset(m.Order, m.Order.objects.prefetch_related('items__artwork'), ('order_id', 'email', 'name'), ('status', 'payment_method'), OrderStaffSerializer),
}
