from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.core.files.storage import default_storage
from django.conf import settings
from backend.collections.models import Collection
import uuid


class CollectionAdminForm(forms.ModelForm):
    cover_upload = forms.ImageField(required=False, label='Upload Cover Image', help_text='Upload a cover image')
    
    class Meta:
        model = Collection
        fields = '__all__'
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle cover image upload
        if self.cleaned_data.get('cover_upload'):
            cover_file = self.cleaned_data['cover_upload']
            ext = cover_file.name.split('.')[-1]
            filename = f"collections/{uuid.uuid4()}.{ext}"
            path = default_storage.save(filename, cover_file)
            instance.cover = f"{settings.MEDIA_URL}{path}"
        
        if commit:
            instance.save()
        return instance


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    form = CollectionAdminForm
    list_display = ('cover_thumbnail', 'no', 'title', 'count', 'hue', 'created_at')
    ordering = ('no',)
    search_fields = ('title', 'blurb')
    list_editable = ('count',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('no', 'title', 'count', 'hue')
        }),
        ('Cover Image', {
            'fields': ('cover_upload',),
            'description': 'Upload a new cover image'
        }),
        ('Cover URL (Optional)', {
            'fields': ('cover',),
            'classes': ('collapse',),
            'description': 'Or paste a direct URL'
        }),
        ('Content', {
            'fields': ('blurb',)
        }),
    )
    
    def cover_thumbnail(self, obj):
        if obj.cover:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.cover
            )
        return '-'
    cover_thumbnail.short_description = 'Cover'
