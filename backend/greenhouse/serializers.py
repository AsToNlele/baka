from rest_framework import serializers
from flowerbed.serializers import FlowerbedSerializer
from greenhouse.models import Greenhouse, GreenhouseAddress

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

