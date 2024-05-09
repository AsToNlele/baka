# Author: Alexandr Celakovsky - xcelak00
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.fields import timezone
from badges.service import add_badge

class Discount(models.Model):
    code = models.CharField(blank=True, null=True, unique=True)
    valid_from = models.DateTimeField(blank=True, null=True)
    valid_to = models.DateTimeField(blank=True, null=True)
    discount_value = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False, null=False, default=0
    )

    class Meta:
        db_table = "discount"


class Order(models.Model):
    user = models.ForeignKey("users.Profile", models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(default="created", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    discount = models.ForeignKey(
        Discount, models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        db_table = "orders"
        db_table_comment = 'There"s flowerbed orders and product_orders'


class FlowerbedOrders(Order):
    rent = models.OneToOneField(
        "flowerbed.Rent", on_delete=models.SET_NULL, blank=True, null=True
    )

    class Meta:
        db_table = "flowerbed_orders"
        db_table_comment = 'There"s flowerbed orders and product_orders'


class ProductOrders(Order):
    class Meta:
        db_table = "product_orders"
        db_table_comment = 'There"s flowerbed orders and product_orders'

class ProductOrderItems(models.Model):
    productOrder = models.ForeignKey(
        ProductOrders, models.DO_NOTHING, blank=True, null=True
    )
    quantity = models.IntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    greenhouseName = models.CharField(max_length=255, blank=True, null=True)
    greenhouseId = models.IntegerField(blank=True, null=True)
    productName = models.CharField(max_length=255, blank=True, null=True)
    productImage = models.CharField(max_length=255, blank=True, null=True)
    productId = models.IntegerField(blank=True, null=True)
    marketplaceProductId = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "product_order_items"
        db_table_comment = 'There"s flowerbed orders and product_orders'

@receiver(post_save, sender=Order)
def add_badges(sender, instance, **kwargs):

    if instance.status == "paid":
        # Check flowerbed orders
        if hasattr(instance, "flowerbedorders"):
            # Check flowerbed order count
            order_count = FlowerbedOrders.objects.filter(user=instance.user, status="paid").count()

            # Gradually add every badge
            if order_count >= 1:
                add_badge(instance.user, "flowerbed", 1)
            if order_count >= 2:
                add_badge(instance.user, "flowerbed", 2)
            if order_count >= 3:
                add_badge(instance.user, "flowerbed", 3)
            if order_count >= 4:
                add_badge(instance.user, "flowerbed", 4)
            if order_count >= 5:
                add_badge(instance.user, "flowerbed", 5)
            
        # Check product orders
        elif hasattr(instance, "productorders"):
            sum = ProductOrders.objects.filter(user=instance.user, status="paid").aggregate(models.Sum("final_price"))["final_price__sum"] or 0

            # Gradually add every badge
            if sum >= 100:
                add_badge(instance.user, "marketplace", 1)
            if sum >= 500:
                add_badge(instance.user, "marketplace", 2)
            if sum >= 1000:
                add_badge(instance.user, "marketplace", 3)
            if sum >= 5000:
                add_badge(instance.user, "marketplace", 4)
            if sum >= 10000:
                add_badge(instance.user, "marketplace", 5)

