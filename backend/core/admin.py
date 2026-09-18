from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.core.files.storage import default_storage
from django.conf import settings
from core.models import SiteMedia, CommissionPricing, CommissionTier
import uuid


class SiteMediaAdminForm(forms.ModelForm):
    file_upload = forms.FileField(required=False, label='Upload File', help_text='Upload an image or video')
    
    class Meta:
        model = SiteMedia
        fields = '__all__'
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle file upload
        if self.cleaned_data.get('file_upload'):
            file = self.cleaned_data['file_upload']
            ext = file.name.split('.')[-1]
            filename = f"site-media/{uuid.uuid4()}.{ext}"
            path = default_storage.save(filename, file)
            instance.value = f"{settings.MEDIA_URL}{path}"
        
        if commit:
            instance.save()
        return instance


@admin.register(SiteMedia)
class SiteMediaAdmin(admin.ModelAdmin):
    form = SiteMediaAdminForm
    list_display = ('key', 'label', 'preview', 'value')
    search_fields = ('key', 'label')
    ordering = ('key',)
    
    fieldsets = (
        ('Media Information', {
            'fields': ('key', 'label')
        }),
        ('File Upload', {
            'fields': ('file_upload',),
            'description': 'Upload a new file (image or video)'
        }),
        ('URL (Optional)', {
            'fields': ('value',),
            'classes': ('collapse',),
            'description': 'Or paste a direct URL'
        }),
    )
    
    def preview(self, obj):
        if obj.value:
            # Check if it's an image
            if any(ext in obj.value.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                return format_html(
                    '<img src="{}" style="max-width: 100px; max-height: 50px; object-fit: contain;" />',
                    obj.value
                )
            # Check if it's a video
            elif any(ext in obj.value.lower() for ext in ['.mp4', '.mov', '.webm']):
                return format_html(
                    '<video src="{}" style="max-width: 100px; max-height: 50px;" controls></video>',
                    obj.value
                )
        return '-'
    preview.short_description = 'Preview'


class CommissionTierInline(admin.TabularInline):
    model = CommissionTier
    extra = 1
    ordering = ('order',)
    fields = ('label', 'price', 'description', 'order')


@admin.register(CommissionPricing)
class CommissionPricingAdmin(admin.ModelAdmin):
    list_display = ('id', 'updated_at')
    readonly_fields = ('updated_at',)
    inlines = [CommissionTierInline]
    
    def has_add_permission(self, request):
        # Only allow one commission pricing object
        return not CommissionPricing.objects.exists()


@admin.register(CommissionTier)
class CommissionTierAdmin(admin.ModelAdmin):
    list_display = ('label', 'price', 'order', 'pricing')
    list_editable = ('price', 'order')
    ordering = ('order',)
    search_fields = ('label', 'description')
