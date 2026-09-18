from django.contrib import admin
from orders.models import Order, OrderItem, CommissionInquiry


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('artwork', 'price', 'qty')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'user_email', 'total', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('id', 'user__email', 'user__name', 'email', 'name')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]
    list_editable = ('status',)
    
    fieldsets = (
        ('Order Information', {
            'fields': ('id', 'user', 'status', 'total', 'subtotal')
        }),
        ('Customer Details', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Shipping Address', {
            'fields': ('address', 'city')
        }),
        ('Payment', {
            'fields': ('payment_method',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('id', 'created_at', 'updated_at', 'total', 'subtotal')
    
    actions = ['mark_as_paid', 'mark_as_shipped', 'mark_as_delivered', 'mark_as_cancelled']
    
    def user_name(self, obj):
        return obj.user.name
    user_name.short_description = 'User'
    user_name.admin_order_field = 'user__name'
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def mark_as_paid(self, request, queryset):
        updated = queryset.update(status='paid')
        self.message_user(request, f'{updated} order(s) marked as paid.')
    mark_as_paid.short_description = 'Mark selected as Paid'
    
    def mark_as_shipped(self, request, queryset):
        updated = queryset.update(status='shipped')
        self.message_user(request, f'{updated} order(s) marked as shipped.')
    mark_as_shipped.short_description = 'Mark selected as Shipped'
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} order(s) marked as delivered.')
    mark_as_delivered.short_description = 'Mark selected as Delivered'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} order(s) marked as cancelled.')
    mark_as_cancelled.short_description = 'Mark selected as Cancelled'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'artwork', 'qty', 'price', 'total_price')
    list_filter = ('order__status',)
    search_fields = ('order__id', 'artwork__title')
    readonly_fields = ('order', 'artwork', 'price', 'qty')
    
    def total_price(self, obj):
        return obj.price * obj.qty
    total_price.short_description = 'Total'


@admin.register(CommissionInquiry)
class CommissionInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'type', 'status', 'budget', 'created_at')
    list_filter = ('status', 'type', 'created_at')
    search_fields = ('name', 'email', 'message')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_editable = ('status',)
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email')
        }),
        ('Commission Details', {
            'fields': ('type', 'size', 'medium', 'budget', 'message')
        }),
        ('Reference', {
            'fields': ('ref_image',)
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['mark_as_contacted', 'mark_as_quoted', 'mark_as_accepted', 'mark_as_completed']
    
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} inquiry(ies) marked as contacted.')
    mark_as_contacted.short_description = 'Mark as Contacted'
    
    def mark_as_quoted(self, request, queryset):
        updated = queryset.update(status='quoted')
        self.message_user(request, f'{updated} inquiry(ies) marked as quoted.')
    mark_as_quoted.short_description = 'Mark as Quoted'
    
    def mark_as_accepted(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(request, f'{updated} inquiry(ies) marked as accepted.')
    mark_as_accepted.short_description = 'Mark as Accepted'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} inquiry(ies) marked as completed.')
    mark_as_completed.short_description = 'Mark as Completed'
