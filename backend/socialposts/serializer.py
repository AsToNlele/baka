# Author: Alexandr Celakovsky - xcelak00
from rest_framework import serializers
from socialposts.models import SocialPost
from users.serializers import SmallProfileSerializer


class SocialPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialPost
        fields = "__all__"


class SocialPostAppSerializer(serializers.ModelSerializer):
    author = SmallProfileSerializer()

    class Meta:
        model = SocialPost
        fields = "__all__"


class CreateSocialPostSerializer(serializers.ModelSerializer):
    post_type = serializers.CharField(required=False, default="ig")

    class Meta:
        model = SocialPost
        fields = [
            "url",
            "post_type",
        ]

    def validate_url(self, value):
        if not value.startswith("https://instagram.com") and not value.startswith(
            "https://www.instagram.com"
        ):
            raise serializers.ValidationError("Must be an Instagram post URL")
        return value


class EditSocialPostSerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=False)

    class Meta:
        model = SocialPost
        fields = [
            "url",
            "approved",
        ]
