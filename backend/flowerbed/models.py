from datetime import datetime

from django.db import models
from greenhouse.models import Greenhouse
from quickstart.models import Profile

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
    dimension_width = models.FloatField(default=0, blank=False, null=False)
    dimension_height = models.FloatField(default=0, blank=False, null=False)
    idealPlants = models.CharField(max_length=100, blank=True, null=True)
    tools = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "flowerbeds"


class Lease(models.Model):
    flowerbed = models.ForeignKey(Flowerbed, models.DO_NOTHING, blank=True, null=True)
    leased_from = models.DateTimeField(
        default=datetime.now, blank=True, null=True
    )  # Field renamed because it was a Python reserved word.
    leased_to = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(Profile, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = "leases"
