from django.db import models

from quickstart.models import Profile

# Create your models here.
class Greenhouse(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

