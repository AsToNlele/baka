from datetime import datetime

from django.db import models
from django.db.models.signals import post_save
from greenhouse.models import Greenhouse
from users.models import Profile

# class FlowerbedIdealPlants(models.Model):
#     flowerbed = models.ForeignKey("Flowerbed", models.DO_NOTHING, blank=True, null=True)
#     name = models.CharField(blank=True, null=True)
#
#     class Meta:
#         db_table = "flowerbed_ideal_plants"
#
# class FlowerbedTools(models.Model):
#     flowerbed = models.ForeignKey("Flowerbed", models.DO_NOTHING, blank=True, null=True)
#     name = models.CharField(blank=True, null=True)
#
#     class Meta:
#         db_table = "flowerbed_tools"


# Create your models here.
class Flowerbed(models.Model):
    greenhouse = models.ForeignKey(Greenhouse, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(blank=True, null=True)
    disabled = models.BooleanField(default=False, blank=True, null=True)
    dimension_width = models.FloatField(default=1.0, blank=False, null=False)
    dimension_height = models.FloatField(default=1.0, blank=False, null=False)
    idealPlants = models.CharField(max_length=100, blank=True, null=True)
    tools = models.CharField(max_length=100, blank=True, null=True)
    pricePerDay = models.DecimalField(
        max_digits=10, decimal_places=5, default=50, blank=False, null=False
    )

    class Meta:
        db_table = "flowerbeds"


class UserFlowerbed(models.Model):
    flowerbed = models.ForeignKey(Flowerbed, models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(Profile, models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = "user_flowerbeds"


class FlowerbedHarvest(models.Model):
    user_flowerbed = models.ForeignKey(
        UserFlowerbed, models.SET_NULL, blank=True, null=True
    )
    name = models.CharField(blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "flowerbed_harvests"


class FlowerbedNote(models.Model):
    user_flowerbed = models.ForeignKey(
        UserFlowerbed, models.SET_NULL, blank=True, null=True
    )
    note = models.TextField(blank=True, null=True)
    date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "flowerbed_notes"


class Rent(models.Model):
    flowerbed = models.ForeignKey(Flowerbed, models.DO_NOTHING, blank=True, null=True)
    rented_from = models.DateTimeField(
        default=datetime.now, blank=True, null=True
    )  # Field renamed because it was a Python reserved word.
    rented_to = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(Profile, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = "rents"

def create_userflowerbed(sender, instance, created, **kwargs):
    # if created:
    print("CREATING USERFLOWERBED IF NOT EXISTING")
    print(instance)
    UserFlowerbed.objects.get_or_create(
        user=instance.user, flowerbed=instance.flowerbed
    )
post_save.connect(create_userflowerbed, sender=Rent)
