# products/models.py

from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=100, null=True, blank=True)  
    slug = models.SlugField(max_length=100, null=True, blank=True) 
    category = models.IntegerField( null=True, blank=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    color = models.CharField(max_length=100,null=True, blank=True)
    slug = models.SlugField(max_length=100,null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Product(models.Model):
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('approved', 'approved'),
        ('rejected', 'rejected'),
    ]
    product_id = models.AutoField(primary_key=True)
    name = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    sub_category = models.ForeignKey(SubCategory, on_delete=models.PROTECT, related_name='products', null=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    images = models.JSONField(default=list, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    status = models.TextField(default='Pending')
    pickup_location = models.CharField(max_length=255, blank=True, null=True)
    isArchived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Product {self.product_id} - {self.description[:20]}"

