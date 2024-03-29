from django.db import models
from users.models import Profile


class GreenhouseBusinessHourPeriod(models.Model):
    business_hour = models.ForeignKey(
        "GreenhouseBusinessHour", models.CASCADE, blank=True, null=True
    )
    open = models.TimeField(null=False)
    close = models.TimeField(null=False)

    class Meta:
        db_table = "greenhouse_business_hour_periods"


class GreenhouseBusinessHour(models.Model):
    greenhouse = models.ForeignKey(
        "Greenhouse", models.CASCADE, blank=True, null=True
    )
    day = models.IntegerField(null=False)

    class Meta:
        db_table = "greenhouse_business_hours"


class GreenhouseAddress(models.Model):
    country = models.CharField(blank=True, null=True, default="CZ")
    state = models.CharField(blank=True, null=True)
    city = models.CharField(blank=True, null=True, default="Brno")
    city_part = models.CharField(blank=True, null=True)
    street = models.CharField(blank=True, null=True)
    zipcode = models.CharField(blank=True, null=True)
    latitude = models.CharField(blank=True, null=True)
    longitude = models.CharField(blank=True, null=True)

    class Meta:
        db_table = "greenhouse_address"


class GreenhouseImage(models.Model):
    greenhouse = models.ForeignKey(
        "Greenhouse", models.DO_NOTHING, blank=True, null=True
    )
    image = models.CharField(blank=True, null=True)

    class Meta:
        db_table = "greenhouse_images"


class Greenhouse(models.Model):
    title = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True, db_comment="Description")
    owner = models.ForeignKey(
        Profile, models.DO_NOTHING, blank=False, null=False, related_name="owner"
    )
    rules = models.CharField(blank=True, null=True)
    greenhouse_address = models.OneToOneField(
        GreenhouseAddress, models.DO_NOTHING, blank=True, null=True
    )
    published = models.BooleanField(default=True, blank=False, null=False)
    caretaker = models.ForeignKey(
        Profile, models.DO_NOTHING, blank=True, null=True, related_name="caretaker"
    )
    bank_account_number = models.CharField(blank=True, null=True)

    class Meta:
        db_table = "greenhouses"
