from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.core.files.storage import default_storage
from django.conf import settings
from artworks.models import Artwork, ProcessStep, Testimonial
import uuid


class ArtworkAdminForm(forms.ModelForm):
    image_upload = forms.ImageField(required=False, label='Upload Image', help_text='Upload an image file')
    video_upload = forms.FileField(required=False, label='Upload Video', help_text='Upload a video file')
    
    class Meta:
        model = Artwork
        fields = '__all__'
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle image upload
        if self.cleaned_data.get('image_upload'):
            image_file = self.cleaned_data['image_upload']
            ext = image_file.name.split('.')[-1]
            filename = f"artworks/{uuid.uuid4()}.{ext}"
            path = default_storage.save(filename, image_file)
            instance.image = f"{settings.MEDIA_URL}{path}"
        
        # Handle video upload
        if self.cleaned_data.get('video_upload'):
            video_file = self.cleaned_data['video_upload']
            ext = video_file.name.split('.')[-1]
            filename = f"artworks/{uuid.uuid4()}.{ext}"
            path = default_storage.save(filename, video_file)
            instance.video = f"{settings.MEDIA_URL}{path}"
        
        if commit:
            instance.save()
        return instance


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    form = ArtworkAdminForm
    list_display = ('thumbnail', 'title', 'year', 'medium', 'collection', 'price', 'status', 'featured', 'created_at')
    list_filter = ('status', 'featured', 'collection', 'year')
    search_fields = ('title', 'medium', 'note')
    list_editable = ('status', 'featured', 'price')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'year', 'medium', 'size', 'collection')
        }),
        ('Media Upload', {
            'fields': ('image_upload', 'video_upload'),
            'description': 'Upload new files here (will replace existing URLs)'
        }),
        ('Media URLs (Optional)', {
            'fields': ('image', 'video'),
            'classes': ('collapse',),
            'description': 'Or paste direct URLs here'
        }),
        ('Details', {
            'fields': ('note', 'hue', 'ratio', 'price', 'status', 'featured')
        }),
    )
    
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.image
            )
        return '-'
    thumbnail.short_description = 'Preview'


@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ('no', 'title', 'hue')
    ordering = ('no',)
    search_fields = ('title', 'text')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('who', 'role', 'created_at')
    ordering = ('-created_at',)
    search_fields = ('who', 'role', 'quote')
    date_hierarchy = 'created_at'
