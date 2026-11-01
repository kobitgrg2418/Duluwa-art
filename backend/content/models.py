import base64
import io
import secrets

from django.core.files.base import ContentFile
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from PIL import Image, ImageOps

RENDITION_WIDTHS = (480, 960, 1600)


class Singleton(models.Model):
    """Only one row ever exists; edit it in the admin."""
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):  # never delete the settings rows
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Ordered(models.Model):
    order = models.PositiveIntegerField(default=0, db_index=True, help_text='Lower numbers appear first.')

    class Meta:
        abstract = True
        ordering = ['order', 'id']


# --------------------------------------------------------------------------- site
class SiteSettings(Singleton):
    site_name = models.CharField(max_length=80, default='Duluwa Art')
    wordmark = models.CharField(max_length=40, default='Duluwa', help_text='Big footer / header wordmark.')
    tagline = models.CharField(max_length=200, default='Watercolors from the Himalaya — painted in Nepal, shipped to your wall.')
    header_ships_from_label = models.CharField(max_length=60, default='Ships from')
    header_ships_from_value = models.CharField(max_length=80, default='Pokhara, Nepal')
    header_shipping_label = models.CharField(max_length=60, default='Worldwide shipping')
    header_shipping_value = models.CharField(max_length=80, default='Tracked & insured')
    contact_email = models.EmailField(default='hello@duluwa.art')
    whatsapp_number = models.CharField(max_length=20, blank=True, default='9779800000000', help_text='Digits only, with country code.')
    instagram_url = models.URLField(blank=True, default='https://www.instagram.com/duluwa_art/')
    facebook_url = models.URLField(blank=True)
    studio_location = models.CharField(max_length=120, blank=True, default='Pokhara & Kathmandu, Nepal')
    copyright_text = models.CharField(max_length=120, default='© 2026 Duluwa Art — Nepal')
    newsletter_placeholder = models.CharField(max_length=80, default='Email for new paintings')
    newsletter_thanks = models.CharField(max_length=160, default='Thank you — new paintings will find you first.')
    npr_per_usd = models.DecimalField(max_digits=8, decimal_places=2, default=133, help_text='Used to derive USD prices when an artwork has none.')
    seo_title = models.CharField(max_length=120, default='Duluwa Art — Himalayan watercolors by Kobit Gurung')
    seo_description = models.CharField(max_length=300, default='Original paintings and limited prints by Kobit Gurung.')
    og_image = models.ImageField(upload_to='site/', blank=True, null=True)
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    announcement = models.CharField(max_length=200, blank=True, help_text='Optional banner text; empty = hidden.')

    class Meta:
        verbose_name = 'Site settings'
        verbose_name_plural = 'Site settings'

    def __str__(self):
        return 'Site settings'


class MarqueeItem(Ordered):
    text = models.CharField(max_length=120)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.text


class MenuLink(Ordered):
    PLACEMENT = [('menu', 'Main menu'), ('footer', 'Footer')]
    label = models.CharField(max_length=60)
    href = models.CharField(max_length=200)
    placement = models.CharField(max_length=10, choices=PLACEMENT, default='menu')
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.label} ({self.placement})'


# --------------------------------------------------------------------------- catalogue
class Collection(Ordered):
    slug = models.SlugField(unique=True, max_length=80)
    title = models.CharField(max_length=80)
    blurb = models.CharField(max_length=160, blank=True)
    intro = models.TextField(blank=True)
    cover_artwork = models.ForeignKey('Artwork', null=True, blank=True, on_delete=models.SET_NULL, related_name='+',
                                      help_text='Artwork shown on the collection card.')
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Artwork(Ordered):
    CATEGORY = [('portrait', 'Portrait'), ('landscape', 'Landscape'), ('wildlife', 'Wildlife')]
    TYPE = [('original', 'Original'), ('print', 'Print / limited edition')]
    STATUS = [('available', 'Available'), ('sold', 'Sold')]

    title = models.CharField(max_length=140)
    slug = models.SlugField(unique=True, max_length=140, blank=True, help_text='Auto-filled from the title.')
    series = models.ForeignKey(Collection, on_delete=models.PROTECT, related_name='artworks')
    category = models.CharField(max_length=20, choices=CATEGORY, default='portrait')
    type = models.CharField(max_length=10, choices=TYPE, default='original')
    status = models.CharField(max_length=10, choices=STATUS, default='available')
    one_of_one = models.BooleanField(default=False, verbose_name='1 of 1')
    just_painted = models.BooleanField(default=False)
    width_cm = models.PositiveIntegerField(default=30)
    height_cm = models.PositiveIntegerField(default=40)
    year = models.PositiveIntegerField(default=2026)
    medium = models.CharField(max_length=120, default='Watercolor on cotton paper')
    price_npr = models.PositiveIntegerField(help_text='Originals: full price. Prints: price of the smallest size.')
    price_usd = models.PositiveIntegerField(null=True, blank=True, help_text='Leave empty to derive from the NPR price.')
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text='Comma separated.')
    image = models.ImageField(upload_to='artworks/', help_text='Main photo of the painting.')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # derived automatically from the image
    width_px = models.PositiveIntegerField(default=0, editable=False)
    height_px = models.PositiveIntegerField(default=0, editable=False)
    blur_data_url = models.TextField(blank=True, editable=False)
    rendition_480 = models.ImageField(upload_to='artworks/renditions/', blank=True, editable=False)
    rendition_960 = models.ImageField(upload_to='artworks/renditions/', blank=True, editable=False)
    rendition_1600 = models.ImageField(upload_to='artworks/renditions/', blank=True, editable=False)

    class Meta(Ordered.Meta):
        ordering = ['order', '-year', 'id']

    def __str__(self):
        return self.title

    @property
    def aspect(self):
        return round(self.width_px / self.height_px, 4) if self.height_px else 1

    @property
    def orientation(self):
        return 'landscape' if self.aspect >= 1 else 'portrait'

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(',') if t.strip()]

    def usd(self):
        if self.price_usd:
            return self.price_usd
        rate = float(SiteSettings.load().npr_per_usd or 133)
        return round(self.price_npr / rate)

    def _slug(self):
        base = slugify(self.title) or 'artwork'
        slug, n = base, 2
        while Artwork.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug, n = f'{base}-{n}', n + 1
        return slug

    def _build_renditions(self):
        self.image.open()
        self.image.seek(0)
        img = ImageOps.exif_transpose(Image.open(self.image)).convert('RGB')
        self.width_px, self.height_px = img.size
        thumb = img.copy()
        thumb.thumbnail((20, 20 * 4))
        buf = io.BytesIO()
        thumb.save(buf, 'JPEG', quality=60)
        self.blur_data_url = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
        for w in RENDITION_WIDTHS:
            im = img.copy()
            if im.width > w:
                im.thumbnail((w, int(im.height * w / im.width) + 1))
            out = io.BytesIO()
            im.save(out, 'WEBP', quality=82)
            getattr(self, f'rendition_{w}').save(f'{self.slug}-{w}.webp', ContentFile(out.getvalue()), save=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._slug()
        old = Artwork.objects.filter(pk=self.pk).values_list('image', flat=True).first() if self.pk else None
        super().save(*args, **kwargs)
        if self.image and (old != self.image.name or not self.width_px):
            self._build_renditions()
            super().save(update_fields=['width_px', 'height_px', 'blur_data_url', 'rendition_480', 'rendition_960', 'rendition_1600'])


class ArtworkImage(Ordered):
    """Extra photos for the product gallery (details, signature, in-room shots)."""
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='artworks/gallery/')
    caption = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return f'{self.artwork} — {self.caption or self.pk}'


class PrintSize(Ordered):
    label = models.CharField(max_length=60)
    multiplier = models.DecimalField(max_digits=5, decimal_places=2, default=1)

    def __str__(self):
        return self.label


class PrintPaper(Ordered):
    label = models.CharField(max_length=60)
    add_npr = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.label


class ShippingMethod(Ordered):
    key = models.SlugField(unique=True)
    label = models.CharField(max_length=60)
    days = models.CharField(max_length=40)
    price_npr = models.PositiveIntegerField()
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.label


# --------------------------------------------------------------------------- home page
class HomePage(Singleton):
    hero_lines = models.TextField(default='Duluwa Art showcases\nHimalayan life in\nwater, pigment\nand light', help_text='One headline line per row.')
    hero_finale_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+', help_text='Painting that expands full-bleed at the end of the hero.')
    scroll_hint = models.CharField(max_length=30, default='Scroll')

    shop_title_line1 = models.CharField(max_length=40, default='The')
    shop_title_line2 = models.CharField(max_length=40, default='Collection')
    originals_label = models.CharField(max_length=60, default='Available originals')
    prints_label = models.CharField(max_length=60, default='Prints & limited editions')
    just_painted_label = models.CharField(max_length=60, default='Just painted')

    care_heading = models.CharField(max_length=80, default='Commission & Care')
    care_text = models.TextField(default='Every painting is signed, certified and shipped in archival packaging. Want something made for a specific wall or a specific face? Commission it.')
    care_primary_label = models.CharField(max_length=40, default='Commission a painting')
    care_primary_href = models.CharField(max_length=200, default='/commission')
    care_secondary_label = models.CharField(max_length=40, default='Contact the artist')
    care_secondary_href = models.CharField(max_length=200, default='mailto:hello@duluwa.art')
    care_tall_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    care_wide_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')

    series_heading = models.CharField(max_length=40, default='Series')

    quote_text = models.CharField(max_length=300, default='Every brushstroke carries a face, a path, a mountain of home.')
    quote_author = models.CharField(max_length=80, default='Kobit Gurung')
    quote_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+', help_text='Painting used (zoomed, grayscale) behind the quote.')

    class Meta:
        verbose_name = 'Home page'
        verbose_name_plural = 'Home page'

    def __str__(self):
        return 'Home page'

    @property
    def hero_line_list(self):
        return [l.strip() for l in self.hero_lines.splitlines() if l.strip()]


class HeroLayer(Ordered):
    """A painting that drifts up through the pinned hero headline."""
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name='hero_layers')
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='+')
    left_vw = models.FloatField(default=10, help_text='Horizontal position, % of viewport width.')
    width_vw = models.FloatField(default=20, help_text='Width, % of viewport width.')
    start_vh = models.FloatField(default=100, help_text='Starting offset below the fold, % of viewport height.')
    speed = models.FloatField(default=1.0, help_text='Drift speed factor (0.6–1.6).')
    show_on_mobile = models.BooleanField(default=True)


class InfoTile(Ordered):
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name='info_tiles')
    label = models.CharField(max_length=40)
    value = models.CharField(max_length=100)
    sub = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.label


class CTAPanel(Ordered):
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name='cta_panels')
    title = models.CharField(max_length=60)
    note = models.CharField(max_length=160, blank=True)
    button_label = models.CharField(max_length=40)
    href = models.CharField(max_length=200)
    background = models.CharField(max_length=9, default='#111111')

    def __str__(self):
        return self.title


class FooterFanCard(Ordered):
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name='fan_cards')
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='+')


# --------------------------------------------------------------------------- artist & journal
class ArtistProfile(Singleton):
    name = models.CharField(max_length=80, default='Kobit Gurung')
    headline = models.CharField(max_length=200, default='I paint the people and places I grew up beside.')
    bio = models.TextField(blank=True, help_text='Separate paragraphs with a blank line.')
    portrait_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    photo = models.ImageField(upload_to='artist/', blank=True, null=True, help_text='Optional photo of the artist; overrides the artwork.')
    process_title = models.CharField(max_length=80, default='How a painting is made')
    process_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+', help_text='Painting shown in the process sequence.')

    class Meta:
        verbose_name = 'Artist profile'
        verbose_name_plural = 'Artist profile'

    def __str__(self):
        return self.name


class ProcessStage(Ordered):
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='stages')
    title = models.CharField(max_length=60)
    description = models.TextField()
    image = models.ImageField(upload_to='artist/process/', blank=True, null=True, help_text='Optional real photo of this stage.')

    def __str__(self):
        return self.title


class JournalPost(models.Model):
    slug = models.SlugField(unique=True, max_length=140, blank=True)
    title = models.CharField(max_length=140)
    date = models.DateField(default=timezone.localdate)
    tag = models.CharField(max_length=40, blank=True)
    excerpt = models.CharField(max_length=300, blank=True)
    body = models.TextField(help_text='Separate paragraphs with a blank line.')
    cover_artwork = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    cover_image = models.ImageField(upload_to='journal/', blank=True, null=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date', '-id']

    def save(self, *args, **kwargs):
        if not self.slug:
            base, slug, n = slugify(self.title) or 'post', None, 2
            slug = base
            while JournalPost.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug, n = f'{base}-{n}', n + 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# --------------------------------------------------------------------------- inbound
class CommissionRequest(models.Model):
    STATUS = [('new', 'New'), ('quoted', 'Quoted'), ('accepted', 'Accepted'), ('painting', 'In progress'), ('done', 'Completed'), ('declined', 'Declined')]
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    size = models.CharField(max_length=80, blank=True)
    subject = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)
    budget = models.CharField(max_length=80, blank=True)
    similar_to = models.ForeignKey(Artwork, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    status = models.CharField(max_length=10, choices=STATUS, default='new')
    internal_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} — {self.subject or "commission"}'


class CommissionReference(models.Model):
    request = models.ForeignKey(CommissionRequest, on_delete=models.CASCADE, related_name='references')
    image = models.ImageField(upload_to='commissions/')


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name}: {self.message[:40]}'


class Order(models.Model):
    STATUS = [('pending', 'Pending payment'), ('paid', 'Paid'), ('shipped', 'Shipped'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')]
    METHOD = [('esewa', 'eSewa'), ('khalti', 'Khalti'), ('card', 'Card'), ('bank', 'Bank transfer')]
    order_id = models.CharField(max_length=12, unique=True, editable=False)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')
    payment_method = models.CharField(max_length=10, choices=METHOD, default='bank')
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40)
    country = models.CharField(max_length=80)
    address = models.CharField(max_length=240)
    city = models.CharField(max_length=80)
    zip_code = models.CharField(max_length=20, blank=True)
    shipping_method = models.ForeignKey(ShippingMethod, null=True, on_delete=models.SET_NULL, related_name='orders')
    shipping_npr = models.PositiveIntegerField(default=0)
    subtotal_npr = models.PositiveIntegerField(default=0)
    total_npr = models.PositiveIntegerField(default=0)
    tracking_number = models.CharField(max_length=80, blank=True)
    internal_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = 'DA-' + secrets.token_hex(3).upper()
        super().save(*args, **kwargs)
        if self.status in ('paid', 'shipped', 'delivered'):
            # originals are unique: once paid, mark them sold
            for item in self.items.select_related('artwork'):
                if item.artwork.type == 'original' and item.artwork.status != 'sold':
                    item.artwork.status = 'sold'
                    item.artwork.save(update_fields=['status'])

    def __str__(self):
        return self.order_id


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    artwork = models.ForeignKey(Artwork, on_delete=models.PROTECT)
    option = models.CharField(max_length=120, blank=True)
    qty = models.PositiveIntegerField(default=1)
    unit_npr = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.artwork} × {self.qty}'
