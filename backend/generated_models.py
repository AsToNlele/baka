# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Flowerbeds(models.Model):
    id = models.IntegerField(primary_key=True)
    greenhouse = models.ForeignKey('Greenhouses', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(blank=True, null=True)
    disabled = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'flowerbeds'

class Discounts(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(blank=True, null=True)
    valid_from = models.DateTimeField(blank=True, null=True)
    valid_to = models.DateTimeField(blank=True, null=True)
    type = models.CharField(blank=True, null=True)
    percentage = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    sum = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float

    class Meta:
        db_table = 'discounts'

class FlowerbedOrders(models.Model):
    id = models.IntegerField(primary_key=True)
    lease = models.ForeignKey('Leases', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    discounts = models.ManyToManyField(Discounts, blank=True)

    class Meta:
        db_table = 'flowerbed_orders'
        db_table_comment = 'There"s flowerbed orders and product_orders'

class GreenhouseAddress(models.Model):
    id = models.IntegerField(primary_key=True)
    country = models.CharField(blank=True, null=True)
    state = models.CharField(blank=True, null=True)
    city = models.CharField(blank=True, null=True)
    city_part = models.CharField(blank=True, null=True)
    street = models.CharField(blank=True, null=True)
    zipcode = models.CharField(blank=True, null=True)
    latitude = models.CharField(blank=True, null=True)
    longitude = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'greenhouse_address'


class GreenhouseImages(models.Model):
    id = models.IntegerField(primary_key=True)
    greenhouse = models.ForeignKey('Greenhouses', models.DO_NOTHING, blank=True, null=True)
    image = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'greenhouse_images'


class Greenhouses(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True, db_comment='Description')
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    rules = models.CharField(blank=True, null=True)
    greenhouse_address = models.OneToOneField(GreenhouseAddress, models.DO_NOTHING, blank=True, null=True)
    published = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'greenhouses'


class Leases(models.Model):
    id = models.IntegerField(primary_key=True)
    flowerbed = models.ForeignKey(Flowerbeds, models.DO_NOTHING, blank=True, null=True)
    from_field = models.DateTimeField(db_column='from', blank=True, null=True)  # Field renamed because it was a Python reserved word.
    to = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'leases'


class OrderedProducts(models.Model):
    order = models.ForeignKey('ProductOrders', models.DO_NOTHING, blank=True, null=True)
    product = models.ForeignKey('Products', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(blank=True, null=True)
    description = models.CharField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    quantity = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'ordered_products'
        db_table_comment = 'Store ordered products for history, in case the product is changed'

class ProductOrders(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    discounts = models.ManyToManyField(Discounts, blank=True)
    
    class Meta:
        db_table = 'product_orders'
        db_table_comment = 'There"s flowerbed orders and product_orders'


class Products(models.Model):
    id = models.IntegerField(primary_key=True)
    greenhouse = models.ForeignKey(Greenhouses, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(blank=True, null=True)
    description = models.CharField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    quantity = models.IntegerField(blank=True, null=True)
    disabled = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'products'

class Transactions(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(blank=True, null=True)
    product_order = models.ForeignKey(ProductOrders, models.DO_NOTHING, blank=True, null=True)
    flowerbed_order = models.ForeignKey(FlowerbedOrders, models.DO_NOTHING, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    status = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'transactions'
