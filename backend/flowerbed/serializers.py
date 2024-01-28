from datetime import datetime
from rest_framework import serializers
from flowerbed.models import Flowerbed, Lease

class LeaseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Lease
        fields = "__all__"

class LeaseFlowerbedSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Lease
        fields = "__all__"

class FlowerbedSerializer(serializers.ModelSerializer):
    leases = LeaseFlowerbedSerializer(source="lease_set", many=True, read_only=True)
    currentLease = serializers.SerializerMethodField()

    def get_currentLease(self, obj):
        # Get the current lease for this flowerbed
        # If there is no current lease, return None
        currentLease = obj.lease_set.filter(leased_from__lte=datetime.now(), leased_to__gte=datetime.now()).first()
        return LeaseSerializer(currentLease).data if currentLease else None
    
    class Meta:
        model = Flowerbed
        fields = "__all__"

