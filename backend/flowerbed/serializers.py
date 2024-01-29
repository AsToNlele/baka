from datetime import datetime

from flowerbed.models import Flowerbed, Lease
from greenhouse.models import Greenhouse, GreenhouseAddress
from rest_framework import serializers

# from greenhouse.serializers import GreenhouseAddressSerializer


class LeaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lease
        fields = "__all__"


class LeaseFlowerbedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lease
        fields = "__all__"


class GreenhouseAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseAddress
        fields = "__all__"


class GreenhouseFlowerSerializer(serializers.ModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer()

    class Meta:
        model = Greenhouse
        fields = ["id", "title", "description", "greenhouse_address"]


class FlowerbedSerializer(serializers.ModelSerializer):
    leases = LeaseFlowerbedSerializer(source="lease_set", many=True, read_only=True)
    currentLease = serializers.SerializerMethodField()
    greenhouse = GreenhouseFlowerSerializer()

    def get_currentLease(self, obj):
        # Get the current lease for this flowerbed
        # If there is no current lease, return None
        currentLease = obj.lease_set.filter(
            leased_from__lte=datetime.now(), leased_to__gte=datetime.now()
        ).first()
        return LeaseSerializer(currentLease).data if currentLease else None

    class Meta:
        model = Flowerbed
        fields = "__all__"
