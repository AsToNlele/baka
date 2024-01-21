from rest_framework import serializers
from greenhouse.models import Greenhouse, GreenhouseAddress

class GreenhouseAddressSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = GreenhouseAddress
        fields = "__all__"

class GreenhouseSerializer(serializers.HyperlinkedModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer()
    
    class Meta:
        model = Greenhouse
        fields = "__all__"

