from django.db import models
from rest_framework.fields import timezone
from flowerbed.models import Rent
from users.models import Profile


class Discounts(models.Model):
    code = models.CharField(blank=True, null=True, unique=True)
    valid_from = models.DateTimeField(blank=True, null=True)
    valid_to = models.DateTimeField(blank=True, null=True)
    type = models.CharField(blank=True, null=True)
    percentage = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    sum = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float

    class Meta:
        db_table = "discounts"


class Order(models.Model):
    user = models.ForeignKey(Profile, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(default="created", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    discounts = models.ManyToManyField(Discounts, blank=True)

    class Meta:
        db_table = "orders"
        db_table_comment = 'There"s flowerbed orders and product_orders'


class FlowerbedOrders(Order):
    rent = models.OneToOneField(
        Rent, on_delete=models.SET_NULL, blank=True, null=True
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

    class Meta:
        db_table = "product_order_items"
        db_table_comment = 'There"s flowerbed orders and product_orders'
