from rest_framework import serializers
from .models import NewsletterImage

class NewsletterImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, use_url=False)

    class Meta:
        model = NewsletterImage
        fields = ["image", "image_height", "image_width"]

