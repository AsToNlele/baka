from django.db import models
from rest_framework.fields import timezone

from greenhouse.models import Greenhouse

class Product(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, default="Product")
    description = models.TextField(blank=True, null=True)
    image = models.CharField(blank=True, null=True)
    shared = models.BooleanField(default=False)

    class Meta:
        db_table = "products"
        db_table_comment = 'Products'
    

class SharedProduct(Product):
    class Meta:
        db_table = "shared_products"
        db_table_comment = 'Shared products'

class CustomProduct(Product):
    greenhouse = models.ForeignKey(
        Greenhouse, models.DO_NOTHING, blank=True, null=True
    )
    class Meta:
        db_table = "custom_products"
        db_table_comment = 'Custom products'
    

class MarketplaceProduct(models.Model):
    product = models.ForeignKey(
        "Product", models.DO_NOTHING, blank=True, null=True
    )
    greenhouse = models.ForeignKey(
        Greenhouse, models.DO_NOTHING, blank=True, null=True
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "marketplace_products"
        db_table_comment = 'Marketplace products'
