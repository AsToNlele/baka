from flowerbed.serializers import FlowerbedSerializer
from greenhouse.models import Greenhouse, GreenhouseAddress
from quickstart.models import Profile
from rest_framework import serializers


class GreenhouseAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseAddress
        fields = "__all__"


class GreenhouseSerializer(serializers.ModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer()
    flowerbeds = FlowerbedSerializer(source="flowerbed_set", many=True, read_only=True)

    class Meta:
        model = Greenhouse
        fields = "__all__"


class EditGreenhouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Greenhouse
        fields = ["title", "description", "published"]
        extra_kwargs = {
            "title": {"required": True},
            "description": {"required": True},
            "published": {"required": True},
        }

    def validate(self, attrs):
        return attrs

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.published = validated_data.get("published", instance.published)
        instance.save()
        
        return instance


# class GreenhouseCareTakerSerializer(serializers.ModelSerializer):
#     caretaker = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), required=True)
#
#     class Meta:
#         model = Greenhouse
#         fields = ["caretaker"]
#
#     def validate(self, attrs):
#         return attrs
