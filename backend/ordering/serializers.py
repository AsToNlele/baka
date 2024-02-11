
from rest_framework.schemas.coreapi import serializers

from ordering.models import FlowerbedOrders


class FlowerbedOrderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FlowerbedOrders
        fields = '__all__'
