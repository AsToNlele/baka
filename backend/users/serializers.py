from django.contrib.auth.models import Group, User
from greenhouse.models import Greenhouse
from greenhouse.serializers import GreenhouseSerializer
from rest_framework import serializers
from orders.models import FlowerbedOrders, ProductOrders

from orders.serializers import FlowerbedOrderSerializer, OrderSerializer, ProductOrderSerializer

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    owned_greenhouses = serializers.SerializerMethodField()
    caretaker_greenhouses = serializers.SerializerMethodField()
    superuser = serializers.SerializerMethodField()

    def get_superuser(self, obj):
        return obj.is_superuser

    def get_owned_greenhouses(self, obj):
        return GreenhouseSerializer(
            Greenhouse.objects.filter(owner=obj.profile), many=True
        ).data

    def get_caretaker_greenhouses(self, obj):
        return GreenhouseSerializer(
            Greenhouse.objects.filter(caretaker=obj.profile), many=True
        ).data

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "groups",
            "profile",
            "owned_greenhouses",
            "caretaker_greenhouses",
            "superuser"
        ]


class UserDetailedSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    owned_greenhouses = serializers.SerializerMethodField()
    caretaker_greenhouses = serializers.SerializerMethodField()
    orders = serializers.SerializerMethodField()
    superuser = serializers.SerializerMethodField()

    def get_superuser(self, obj):
        return obj.is_superuser

    def get_orders(self, obj):
        serializer = OrderSerializer(obj.profile.order_set, many=True)
        print(serializer.data)
        orders = []
        for order in serializer.data:
            if order["type"] == "flowerbed":
                flowerbed_order = FlowerbedOrders.objects.get(id=order["id"])
                flowerbed_order_serializer = FlowerbedOrderSerializer(flowerbed_order)
                flowerbedOrder = flowerbed_order_serializer.data
                orders.append(flowerbedOrder)
            else:
                product_order = ProductOrders.objects.get(id=order["id"])
                product_order_serializer = ProductOrderSerializer(product_order)
                productOrder = product_order_serializer.data
                orders.append(productOrder)

        return orders

    def get_owned_greenhouses(self, obj):
        return GreenhouseSerializer(
            Greenhouse.objects.filter(owner=obj.profile), many=True
        ).data

    def get_caretaker_greenhouses(self, obj):
        return GreenhouseSerializer(
            Greenhouse.objects.filter(caretaker=obj.profile), many=True
        ).data

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "groups",
            "profile",
            "owned_greenhouses",
            "caretaker_greenhouses",
            "orders",
            "superuser",
            "is_active"
        ]
    
class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
        ]

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

        from rest_framework import serializers

class SetUserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["is_active"]
