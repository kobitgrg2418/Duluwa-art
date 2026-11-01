from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.html import format_html

from . import models as m

admin.site.site_header = 'Duluwa Art — CMS'
admin.site.site_title = 'Duluwa Art CMS'
admin.site.index_title = 'Edit the website'


def thumb(url, size=56):
    return format_html('<img src="{}" style="height:{}px;border-radius:2px;object-fit:cover">', url, size) if url else '—'


class SingletonAdmin(admin.ModelAdmin):
    """Opens straight on the one and only record."""
    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.model.load()
        return redirect(reverse(f'admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change', args=[obj.pk]))


# ----- site
class MarqueeInline(admin.TabularInline):
    model = m.MarqueeItem
    extra = 0


@admin.register(m.SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    fieldsets = (
        ('Brand', {'fields': ('site_name', 'wordmark', 'tagline', 'logo', 'favicon', 'announcement')}),
        ('Header', {'fields': ('header_ships_from_label', 'header_ships_from_value', 'header_shipping_label', 'header_shipping_value')}),
        ('Contact & social', {'fields': ('contact_email', 'whatsapp_number', 'instagram_url', 'facebook_url', 'studio_location')}),
        ('Footer & newsletter', {'fields': ('copyright_text', 'newsletter_placeholder', 'newsletter_thanks')}),
        ('Money', {'fields': ('npr_per_usd',)}),
        ('SEO', {'fields': ('seo_title', 'seo_description', 'og_image')}),
    )


@admin.register(m.MarqueeItem)
class MarqueeAdmin(admin.ModelAdmin):
    list_display = ('text', 'order', 'is_published')
    list_editable = ('order', 'is_published')


@admin.register(m.MenuLink)
class MenuLinkAdmin(admin.ModelAdmin):
    list_display = ('label', 'href', 'placement', 'order', 'is_published')
    list_editable = ('order', 'is_published')
    list_filter = ('placement',)


# ----- catalogue
class GalleryInline(admin.TabularInline):
    model = m.ArtworkImage
    extra = 1


@admin.register(m.Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ('preview', 'title', 'series', 'type', 'status', 'price_npr', 'just_painted', 'is_published', 'order')
    list_display_links = ('preview', 'title')
    list_editable = ('status', 'price_npr', 'just_painted', 'is_published', 'order')
    list_filter = ('type', 'status', 'series', 'category', 'is_published', 'just_painted')
    search_fields = ('title', 'tags', 'description')
    prepopulated_fields = {}
    readonly_fields = ('preview_large', 'width_px', 'height_px', 'created_at', 'updated_at')
    inlines = [GalleryInline]
    save_on_top = True
    actions = ['mark_sold', 'mark_available', 'publish', 'unpublish']
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'series', 'image', 'preview_large')}),
        ('Listing', {'fields': ('type', 'status', 'one_of_one', 'just_painted', 'category', 'is_published', 'order')}),
        ('Details', {'fields': ('width_cm', 'height_cm', 'year', 'medium', 'description', 'tags')}),
        ('Price', {'fields': ('price_npr', 'price_usd')}),
        ('Image info (automatic)', {'classes': ('collapse',), 'fields': ('width_px', 'height_px', 'created_at', 'updated_at')}),
    )

    @admin.display(description='Image')
    def preview(self, obj):
        return thumb(obj.rendition_480.url if obj.rendition_480 else (obj.image.url if obj.image else None))

    @admin.display(description='Preview')
    def preview_large(self, obj):
        return thumb(obj.rendition_960.url if obj.rendition_960 else None, 260)

    @admin.action(description='Mark selected as sold')
    def mark_sold(self, request, qs): qs.update(status='sold')

    @admin.action(description='Mark selected as available')
    def mark_available(self, request, qs): qs.update(status='available')

    @admin.action(description='Publish selected')
    def publish(self, request, qs): qs.update(is_published=True)

    @admin.action(description='Unpublish selected')
    def unpublish(self, request, qs): qs.update(is_published=False)


@admin.register(m.Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'cover_artwork', 'order', 'is_published')
    list_editable = ('order', 'is_published')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(m.PrintSize)
class PrintSizeAdmin(admin.ModelAdmin):
    list_display = ('label', 'multiplier', 'order')
    list_editable = ('multiplier', 'order')


@admin.register(m.PrintPaper)
class PrintPaperAdmin(admin.ModelAdmin):
    list_display = ('label', 'add_npr', 'order')
    list_editable = ('add_npr', 'order')


@admin.register(m.ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = ('label', 'days', 'price_npr', 'order', 'is_published')
    list_editable = ('price_npr', 'order', 'is_published')
    prepopulated_fields = {'key': ('label',)}


# ----- home
class HeroLayerInline(admin.TabularInline):
    model = m.HeroLayer
    extra = 0


class InfoTileInline(admin.TabularInline):
    model = m.InfoTile
    extra = 0


class CTAInline(admin.TabularInline):
    model = m.CTAPanel
    extra = 0


class FanInline(admin.TabularInline):
    model = m.FooterFanCard
    extra = 0


@admin.register(m.HomePage)
class HomePageAdmin(SingletonAdmin):
    inlines = [HeroLayerInline, InfoTileInline, CTAInline, FanInline]
    fieldsets = (
        ('Hero', {'fields': ('hero_lines', 'hero_finale_artwork', 'scroll_hint')}),
        ('Shop section', {'fields': ('shop_title_line1', 'shop_title_line2', 'originals_label', 'prints_label', 'just_painted_label')}),
        ('Commission & care (dark section)', {'fields': ('care_heading', 'care_text', 'care_primary_label', 'care_primary_href', 'care_secondary_label', 'care_secondary_href', 'care_tall_artwork', 'care_wide_artwork')}),
        ('Series', {'fields': ('series_heading',)}),
        ('Quote', {'fields': ('quote_text', 'quote_author', 'quote_artwork')}),
    )


# ----- artist & journal
class StageInline(admin.StackedInline):
    model = m.ProcessStage
    extra = 0


@admin.register(m.ArtistProfile)
class ArtistAdmin(SingletonAdmin):
    inlines = [StageInline]


@admin.register(m.JournalPost)
class JournalAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'tag', 'is_published')
    list_editable = ('is_published',)
    search_fields = ('title', 'body')
    prepopulated_fields = {'slug': ('title',)}


# ----- inbound
class ReferenceInline(admin.TabularInline):
    model = m.CommissionReference
    extra = 0
    readonly_fields = ('preview',)

    @admin.display(description='Preview')
    def preview(self, obj):
        return thumb(obj.image.url if obj.pk else None, 90)


@admin.register(m.CommissionRequest)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'size', 'budget', 'status', 'created_at')
    list_filter = ('status',)
    list_editable = ('status',)
    search_fields = ('name', 'email', 'notes')
    inlines = [ReferenceInline]
    date_hierarchy = 'created_at'


@admin.register(m.NewsletterSubscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('email',)


@admin.register(m.ContactMessage)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_read', 'created_at')
    list_filter = ('is_read',)
    list_editable = ('is_read',)


class OrderItemInline(admin.TabularInline):
    model = m.OrderItem
    extra = 0


@admin.register(m.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'name', 'email', 'total_npr', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method')
    list_editable = ('status',)
    search_fields = ('order_id', 'name', 'email')
    readonly_fields = ('order_id', 'subtotal_npr', 'shipping_npr', 'total_npr')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    actions = ['mark_paid', 'mark_shipped']

    @admin.action(description='Mark paid (originals become sold)')
    def mark_paid(self, request, qs):
        for o in qs:
            o.status = 'paid'
            o.save()

    @admin.action(description='Mark shipped')
    def mark_shipped(self, request, qs):
        for o in qs:
            o.status = 'shipped'
            o.save()
