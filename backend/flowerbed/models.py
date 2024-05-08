from datetime import datetime

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from flowerbed.service import get_emission_stats, get_savings_stats
from badges.service import add_badge

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
    greenhouse = models.ForeignKey("greenhouse.Greenhouse", models.DO_NOTHING, blank=True, null=True)
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
    user = models.ForeignKey("users.Profile", models.SET_NULL, blank=True, null=True)

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

@receiver(post_save, sender=FlowerbedHarvest)
def check_badges(sender, instance, created, **kwargs):
    # Get UserFlowerbed
    user_flowerbed = instance.user_flowerbed

    # Get emissions
    (emissionSum, _) = get_emission_stats(user_flowerbed)

    # Add emission badges
    if emissionSum >= 1:
        add_badge(user_flowerbed.user, "emission", 1)
    if emissionSum >= 5:
        add_badge(user_flowerbed.user, "emission", 2)
    if emissionSum >= 10:
        add_badge(user_flowerbed.user, "emission", 3)
    if emissionSum >= 50:
        add_badge(user_flowerbed.user, "emission", 4)
    if emissionSum >= 100:
        add_badge(user_flowerbed.user, "emission", 5)

    # Get savings
    savings = get_savings_stats(user_flowerbed)

    # Add savings badges
    if savings >= 100:
        add_badge(user_flowerbed.user, "savings", 1)
    if savings >= 500:
        add_badge(user_flowerbed.user, "savings", 2)
    if savings >= 1000:
        add_badge(user_flowerbed.user, "savings", 3)
    if savings >= 2500:
        add_badge(user_flowerbed.user, "savings", 4)
    if savings >= 5000:
        add_badge(user_flowerbed.user, "savings", 5)

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
    user = models.ForeignKey("users.Profile", models.DO_NOTHING, blank=True, null=True)

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
