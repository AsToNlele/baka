from django.db.models import Choices
from flowerbed.models import Flowerbed, Rent
from greenhouse.models import Greenhouse, GreenhouseAddress, GreenhouseBusinessHour, GreenhouseBusinessHourPeriod
from orders.models import FlowerbedOrders, Order, ProductOrderItems
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


class ProductOrderItemSerializer(serializers.ModelSerializer):
    productOrder = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = ProductOrderItems
        fields = "__all__"


class ProductOrderSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = ProductOrderItemSerializer(many=True, source="productorderitems_set")

    class Meta:
        model = Order
        fields = "__all__"

    def get_type(self, obj):
        return "product"


class PaymentSerializer(serializers.Serializer):
    receiver = serializers.CharField()
    receiver_iban = serializers.CharField()
    vs = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
class GreenhouseAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseAddress
        fields = "__all__"


class GreenhouseBusinessHourPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseBusinessHourPeriod
        fields = "__all__"


class GreenhouseBusinessHourSerializer(serializers.ModelSerializer):
    greenhouse_business_hour_periods = GreenhouseBusinessHourPeriodSerializer(
        source="greenhousebusinesshourperiod_set", many=True
    )

    class Meta:
        model = GreenhouseBusinessHour
        fields = "__all__"



class GreenhouseWithAddressSerializer(serializers.ModelSerializer):
    greenhouse_business_hours = GreenhouseBusinessHourSerializer(
        source="greenhousebusinesshour_set", many=True
    )
    greenhouse_address = GreenhouseAddressSerializer()
    class Meta:
        model = Greenhouse
        fields = "__all__"


class GetPickupLocationsSerializer(serializers.Serializer):
    greenhouse = GreenhouseWithAddressSerializer()
    items = ProductOrderItemSerializer(many=True)

class EditOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status", "final_price"]
