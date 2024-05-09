# Author: Alexandr Celakovsky - xcelak00
from rest_framework import serializers
from .models import NewsletterImage, NewsletterPost

class NewsletterImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, use_url=False)

    class Meta:
        model = NewsletterImage
        fields = ["image", "image_height", "image_width"]

class NewsletterPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterPost
        fields = ["title", "content", "created_at"]

