from django.db import models
from rest_framework.fields import timezone
from users.models import Profile


# Create your models here.
class SocialPost(models.Model):
    url = models.URLField()
    post_type = models.TextField()
    approved = models.BooleanField(default=False)
    author = models.ForeignKey(
        Profile, models.SET_NULL, blank=True, null=True, related_name="socialpost_author"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
