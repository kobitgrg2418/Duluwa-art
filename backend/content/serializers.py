from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from . import models as m


def abs_url(request, f):
    if not f:
        return None
    return request.build_absolute_uri(f.url) if request else f.url


# ---------------------------------------------------------------- public (read)
class ArtworkListSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    series = serializers.SlugRelatedField(slug_field='slug', read_only=True)
    series_title = serializers.CharField(source='series.title', read_only=True)
    orientation = serializers.CharField(read_only=True)
    aspect = serializers.FloatField(read_only=True)
    width = serializers.IntegerField(source='width_px', read_only=True)
    height = serializers.IntegerField(source='height_px', read_only=True)
    price_usd = serializers.SerializerMethodField()
    tags = serializers.ListField(source='tag_list', read_only=True)
    image = serializers.SerializerMethodField()
    renditions = serializers.SerializerMethodField()

    class Meta:
        model = m.Artwork
        fields = ['id', 'slug', 'title', 'series', 'series_title', 'category', 'orientation', 'width_cm', 'height_cm', 'year',
                  'medium', 'type', 'price_npr', 'price_usd', 'status', 'one_of_one', 'just_painted', 'image', 'renditions',
                  'width', 'height', 'aspect', 'blur_data_url', 'description', 'tags', 'order']

    def get_price_usd(self, o):
        return o.usd()

    def get_image(self, o):
        return abs_url(self.context.get('request'), o.image)

    def get_renditions(self, o):
        r = self.context.get('request')
        return {str(w): abs_url(r, getattr(o, f'rendition_{w}')) for w in m.RENDITION_WIDTHS}


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = m.ArtworkImage
        fields = ['id', 'image', 'caption', 'order']


class ArtworkDetailSerializer(ArtworkListSerializer):
    gallery = GallerySerializer(many=True, read_only=True)
    related = serializers.SerializerMethodField()

    class Meta(ArtworkListSerializer.Meta):
        fields = ArtworkListSerializer.Meta.fields + ['gallery', 'related']

    def get_related(self, o):
        qs = m.Artwork.objects.filter(is_published=True).exclude(pk=o.pk).select_related('series')
        same = list(qs.filter(series=o.series)[:8])
        rest = list(qs.exclude(series=o.series)[:max(0, 8 - len(same))])
        return ArtworkListSerializer(same + rest, many=True, context=self.context).data


class CollectionSerializer(serializers.ModelSerializer):
    artwork_count = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField()

    class Meta:
        model = m.Collection
        fields = ['slug', 'title', 'blurb', 'intro', 'artwork_count', 'cover', 'order']

    def get_artwork_count(self, o):
        return o.artworks.filter(is_published=True).count()

    def get_cover(self, o):
        art = o.cover_artwork or o.artworks.filter(is_published=True).first()
        return ArtworkListSerializer(art, context=self.context).data if art else None


class CollectionDetailSerializer(CollectionSerializer):
    artworks = serializers.SerializerMethodField()

    class Meta(CollectionSerializer.Meta):
        fields = CollectionSerializer.Meta.fields + ['artworks']

    def get_artworks(self, o):
        return ArtworkListSerializer(o.artworks.filter(is_published=True), many=True, context=self.context).data


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.SiteSettings
        exclude = ['id']


class MenuLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.MenuLink
        fields = ['label', 'href', 'placement', 'order']


class JournalSerializer(serializers.ModelSerializer):
    paragraphs = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField()

    class Meta:
        model = m.JournalPost
        fields = ['slug', 'title', 'date', 'tag', 'excerpt', 'body', 'paragraphs', 'cover']

    def get_paragraphs(self, o):
        return [p.strip() for p in o.body.split('\n\n') if p.strip()]

    def get_cover(self, o):
        req = self.context.get('request')
        if o.cover_image:
            return {'image': abs_url(req, o.cover_image), 'artwork': None}
        if o.cover_artwork:
            return {'image': None, 'artwork': ArtworkListSerializer(o.cover_artwork, context=self.context).data}
        return None


class ProcessStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.ProcessStage
        fields = ['id', 'title', 'description', 'image', 'order']


class ArtistSerializer(serializers.ModelSerializer):
    paragraphs = serializers.SerializerMethodField()
    portrait_artwork = serializers.SerializerMethodField()
    process_artwork = serializers.SerializerMethodField()
    stages = ProcessStageSerializer(many=True, read_only=True)

    class Meta:
        model = m.ArtistProfile
        fields = ['name', 'headline', 'bio', 'paragraphs', 'photo', 'portrait_artwork', 'process_title', 'process_artwork', 'stages']

    def get_paragraphs(self, o):
        return [p.strip() for p in o.bio.split('\n\n') if p.strip()]

    def _art(self, a):
        return ArtworkListSerializer(a, context=self.context).data if a else None

    def get_portrait_artwork(self, o):
        return self._art(o.portrait_artwork)

    def get_process_artwork(self, o):
        return self._art(o.process_artwork)


class PrintSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.PrintSize
        fields = ['id', 'label', 'multiplier', 'order']


class PrintPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.PrintPaper
        fields = ['id', 'label', 'add_npr', 'order']


class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.ShippingMethod
        fields = ['key', 'label', 'days', 'price_npr', 'order']


# ---------------------------------------------------------------- public (write)
class CommissionCreateSerializer(serializers.ModelSerializer):
    similar = serializers.SlugRelatedField(slug_field='slug', queryset=m.Artwork.objects.all(), required=False, allow_null=True, source='similar_to')
    references = serializers.ListField(child=serializers.ImageField(), required=False, write_only=True, max_length=4)

    class Meta:
        model = m.CommissionRequest
        fields = ['id', 'name', 'email', 'phone', 'size', 'subject', 'notes', 'budget', 'similar', 'references']
        read_only_fields = ['id']

    def create(self, data):
        refs = data.pop('references', [])
        obj = super().create(data)
        for f in refs:
            m.CommissionReference.objects.create(request=obj, image=f)
        return obj


class NewsletterSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, data):
        obj, _ = m.NewsletterSubscriber.objects.get_or_create(email=data['email'].lower())
        if not obj.is_active:
            obj.is_active = True
            obj.save()
        return obj


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.ContactMessage
        fields = ['id', 'name', 'email', 'message']
        read_only_fields = ['id']


class OrderItemInSerializer(serializers.Serializer):
    artwork = serializers.SlugRelatedField(slug_field='slug', queryset=m.Artwork.objects.filter(is_published=True))
    qty = serializers.IntegerField(min_value=1, max_value=20, default=1)
    size_index = serializers.IntegerField(min_value=0, default=0)
    paper_index = serializers.IntegerField(min_value=0, default=0)


def print_price(artwork, size, paper):
    mult = Decimal(size.multiplier)
    return int(round((Decimal(artwork.price_npr) * mult + paper.add_npr) / 100) * 100)


class OrderCreateSerializer(serializers.ModelSerializer):
    """Prices are always recomputed server-side; the client only chooses what and how many."""
    items = OrderItemInSerializer(many=True, write_only=True, min_length=1)
    shipping_method = serializers.SlugRelatedField(slug_field='key', queryset=m.ShippingMethod.objects.filter(is_published=True))

    class Meta:
        model = m.Order
        fields = ['order_id', 'status', 'name', 'email', 'phone', 'country', 'address', 'city', 'zip_code', 'payment_method',
                  'shipping_method', 'items', 'subtotal_npr', 'shipping_npr', 'total_npr']
        read_only_fields = ['order_id', 'status', 'subtotal_npr', 'shipping_npr', 'total_npr']

    def validate(self, data):
        sizes, papers = list(m.PrintSize.objects.all()), list(m.PrintPaper.objects.all())
        lines = []
        for it in data['items']:
            a = it['artwork']
            if a.status == 'sold':
                raise serializers.ValidationError({'items': f'“{a.title}” has already been sold.'})
            if a.type == 'original':
                lines.append((a, '', 1, a.price_npr))
                continue
            if not sizes or not papers:
                raise serializers.ValidationError({'items': 'Print options are not configured.'})
            try:
                s, p = sizes[it['size_index']], papers[it['paper_index']]
            except IndexError:
                raise serializers.ValidationError({'items': 'Invalid print size or paper.'})
            lines.append((a, f'{s.label} · {p.label}', it['qty'], print_price(a, s, p)))
        data['_lines'] = lines
        return data

    @transaction.atomic
    def create(self, data):
        lines = data.pop('_lines')
        data.pop('items')
        sub = sum(q * u for _, _, q, u in lines)
        ship = data['shipping_method']
        order = m.Order.objects.create(**data, shipping_npr=ship.price_npr, subtotal_npr=sub, total_npr=sub + ship.price_npr)
        for a, opt, q, u in lines:
            m.OrderItem.objects.create(order=order, artwork=a, option=opt, qty=q, unit_npr=u)
        return order


class OrderItemOutSerializer(serializers.ModelSerializer):
    artwork = serializers.CharField(source='artwork.slug')
    title = serializers.CharField(source='artwork.title')

    class Meta:
        model = m.OrderItem
        fields = ['artwork', 'title', 'option', 'qty', 'unit_npr']


class OrderOutSerializer(serializers.ModelSerializer):
    items = OrderItemOutSerializer(many=True)

    class Meta:
        model = m.Order
        fields = ['order_id', 'status', 'payment_method', 'subtotal_npr', 'shipping_npr', 'total_npr', 'tracking_number', 'created_at', 'items']


# ---------------------------------------------------------------- staff (full CRUD)
class StaffModelSerializer(serializers.ModelSerializer):
    """Multipart forms omit unchecked booleans; keep the model default instead of silently turning them off.
    To switch a flag off, send it explicitly (``is_published=false``)."""

    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        for f in self.fields.values():
            if isinstance(f, serializers.BooleanField):
                f.default_empty_html = serializers.empty


def model_serializer(model, **extra):
    meta = type('Meta', (), {'model': model, 'fields': '__all__'})
    return type(f'{model.__name__}ManageSerializer', (StaffModelSerializer,), {'Meta': meta, **extra})
