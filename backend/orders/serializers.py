from django.db.models import Choices
from flowerbed.models import Flowerbed, Rent
from greenhouse.models import Greenhouse
from orders.models import FlowerbedOrders, Order
from rest_framework.schemas.coreapi import serializers

orderTypes = Choices(("flowerbed"), ("product"))

class greenhouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Greenhouse
        fields = "__all__"

class FlowerbedSerializer(serializers.ModelSerializer):
    greenhouse = greenhouseSerializer()
    class Meta:
        model = Flowerbed
        fields = "__all__"

class RentFlowerbedSerializer(serializers.ModelSerializer):
    flowerbed = FlowerbedSerializer()
    class Meta:
        model = Rent
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_type(self, obj):
        if hasattr(obj, "flowerbedorders"):
            return "flowerbed"
        else:
            return "product"


class FlowerbedOrderSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    rent = RentFlowerbedSerializer()
    class Meta:
        model = FlowerbedOrders
        fields = "__all__"
        
    def get_type(self, obj):
        return "flowerbed"

