# Author: Alexandr Celakovsky - xcelak00
from django.contrib.auth.models import Group, User
from greenhouse.models import Greenhouse
from greenhouse.serializers import GreenhouseSerializer
from orders.models import FlowerbedOrders, ProductOrders
from orders.serializers import (
    FlowerbedOrderSerializer,
    OrderSerializer,
    ProductOrderSerializer,
)
from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

class SmallProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Profile
        fields = ["id", "user"]

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
            "superuser",
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
            "is_active",
        ]


class EditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["receive_newsletter"]


class EditSelfUserSerializer(serializers.ModelSerializer):
    profile = EditProfileSerializer(required=False)

    def update(self, instance, validated_data):
        if "profile" in validated_data:
            profile_data = validated_data.pop("profile")
            profile = instance.profile
            profile.receive_newsletter = profile_data.get(
                "receive_newsletter", False
            )
            profile.save()
        else:
            instance.profile.receive_newsletter = False
            instance.profile.save()
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = [
            "profile",
            "first_name",
            "last_name",
            "email",
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


class RegisterUserWithEmailSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    subscribe_newsletter = serializers.BooleanField()

    class Meta:
        fields = ["username", "email", "password", "first_name", "last_name"]
