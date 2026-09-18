from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.core.files.storage import default_storage
from django.conf import settings
from users.models import User
import uuid


class UserAdminForm(forms.ModelForm):
    avatar_upload = forms.ImageField(required=False, label='Upload Avatar', help_text='Upload an avatar image')
    
    class Meta:
        model = User
        fields = '__all__'
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle avatar upload
        if self.cleaned_data.get('avatar_upload'):
            avatar_file = self.cleaned_data['avatar_upload']
            ext = avatar_file.name.split('.')[-1]
            filename = f"avatars/{uuid.uuid4()}.{ext}"
            path = default_storage.save(filename, avatar_file)
            instance.avatar = f"{settings.MEDIA_URL}{path}"
        
        if commit:
            instance.save()
        return instance


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ('avatar_thumbnail', 'email', 'name', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'created_at')
    search_fields = ('email', 'name')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Account Information', {
            'fields': ('email', 'name', 'role', 'is_active')
        }),
        ('Avatar Upload', {
            'fields': ('avatar_upload',),
            'description': 'Upload a new avatar image'
        }),
        ('Avatar URL (Optional)', {
            'fields': ('avatar',),
            'classes': ('collapse',),
            'description': 'Or paste a direct URL'
        }),
        ('Profile', {
            'fields': ('phone', 'address')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def avatar_thumbnail(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />',
                obj.avatar
            )
        return '-'
    avatar_thumbnail.short_description = 'Avatar'
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('email',)
        return self.readonly_fields
