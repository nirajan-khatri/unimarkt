from django.contrib import admin
from .models import Category, SubCategory, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['product_id', 'name', 'user', 'category', 'sub_category', 'price', 'status', 'pickup_location', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['name', 'description', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    actions = ['approve_products', 'reject_products', 'archive_products', 'unarchive_products']
    
    def approve_products(self, request, queryset):
        queryset.update(status='approved')
    approve_products.short_description = "Approve selected products"
    
    def reject_products(self, request, queryset):
        queryset.update(status='rejected')
    reject_products.short_description = "Reject selected products"
    
    def archive_products(self, request, queryset):
        queryset.update(status='archived')
    archive_products.short_description = "Archive selected products"
    
    def unarchive_products(self, request, queryset):
        queryset.update(status='pending')
    unarchive_products.short_description = "Unarchive selected products (set to pending)"