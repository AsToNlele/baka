from django.db import models

class Badge(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    badge_type = models.CharField(max_length=255)
    badge_level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey("users.Profile", on_delete=models.CASCADE, related_name="badgeuser")

    def __str__(self):
        return self.name
