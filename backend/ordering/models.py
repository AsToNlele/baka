from datetime import datetime

from django.db import models
from flowerbed.models import Lease
from quickstart.models import Profile


class Discounts(models.Model):
    code = models.CharField(blank=True, null=True, unique=True)
    valid_from = models.DateTimeField(blank=True, null=True)
    valid_to = models.DateTimeField(blank=True, null=True)
    type = models.CharField(blank=True, null=True)
    percentage = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    sum = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float

    class Meta:
        db_table = "discounts"


class FlowerbedOrders(models.Model):
    lease = models.ForeignKey(Lease, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(Profile, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(default="created", blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.now(), blank=True, null=True)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    discounts = models.ManyToManyField(Discounts, blank=True)

    class Meta:
        db_table = "flowerbed_orders"
        db_table_comment = 'There"s flowerbed orders and product_orders'


class ProductOrders(models.Model):
    user = models.ForeignKey(Profile, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(default="created", blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    discounts = models.ManyToManyField(Discounts, blank=True)

    class Meta:
        db_table = "product_orders"
        db_table_comment = 'There"s flowerbed orders and product_orders'
