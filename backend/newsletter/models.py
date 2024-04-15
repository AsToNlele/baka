from django.db import models
from rest_framework.fields import timezone

def upload_to(instance, filename):
    return f"newsletter-images/{filename}"
# Create your models here.
class NewsletterImage(models.Model):
    image = models.ImageField(upload_to=upload_to, blank=True, null=True, width_field=
"image_width", height_field="image_height")
    image_width = models.PositiveIntegerField(default=0)
    image_height = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

class NewsletterPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.JSONField()
    created_at = models.DateTimeField(default=timezone.now)
