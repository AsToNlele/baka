from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string

# from greenhouse.models import Greenhouse

# from greenhouse.models import Greenhouse

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    primary_greenhouseId = models.IntegerField(null=True, blank=True)
    receive_newsletter = models.BooleanField(default=False)
    activated_once = models.BooleanField(default=False)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

