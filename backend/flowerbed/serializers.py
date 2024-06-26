# Author: Alexandr Celakovsky - xcelak00
from datetime import date, datetime

from flowerbed.models import (
    Flowerbed,
    FlowerbedHarvest,
    FlowerbedNote,
    Rent,
    UserFlowerbed,
)
from greenhouse.models import Greenhouse, GreenhouseAddress
from orders.serializers import FlowerbedOrderSerializer
from rest_framework import serializers
from users.models import Profile


class SmallProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Profile
        fields = ["id", "user"]


class FlowerbedStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[("rented", "Rented"), ("free", "Free")])


class CreateRentSerializer(serializers.ModelSerializer):
    discount_code = serializers.CharField(required=False)

    class Meta:
        model = Rent
        fields = [
            "rented_from",
            "rented_to",
            "discount_code"
        ]
        extra_kwargs = {
            "rented_from": {"required": True},
            "rented_to": {"required": True},
        }

    def validate(self, attrs):
        return attrs


class RentSerializer(serializers.ModelSerializer):
    order = FlowerbedOrderSerializer(source="flowerbedorders")

    class Meta:
        model = Rent
        fields = "__all__"


class RentFlowerbedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rent
        fields = "__all__"


class GreenhouseAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseAddress
        fields = "__all__"


class GreenhouseFlowerSerializer(serializers.ModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer()
    image = serializers.ImageField(use_url=False, required=False)

    class Meta:
        model = Greenhouse
        fields = ["id", "title", "description", "greenhouse_address", "image"]


class FlowerbedSerializer(serializers.ModelSerializer):
    rents = RentFlowerbedSerializer(source="rent_set", many=True, read_only=True)
    currentRent = serializers.SerializerMethodField()
    greenhouse = GreenhouseFlowerSerializer()
    extendable = serializers.SerializerMethodField()

    def get_currentRent(self, obj):
        currentRent = obj.rent_set.filter(
            rented_from__lte=date.today(), rented_to__gte=date.today()
        ).first()
        return RentSerializer(currentRent).data if currentRent else None

    def get_extendable(self, obj):
        # Check if there' a next rent already rented
        rents = obj.rent_set.filter(rented_from__gte=datetime.now())
        if len(rents) > 0:
            return False
        return True

    class Meta:
        model = Flowerbed
        fields = "__all__"


class CreateFlowerbedSerializer(serializers.ModelSerializer):
    greenhouse = serializers.PrimaryKeyRelatedField(queryset=Greenhouse.objects.all())

    class Meta:
        model = Flowerbed
        fields = "__all__"


class EditFlowerbedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flowerbed
        fields = "__all__"


class FlowerbedHarvestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowerbedHarvest
        fields = "__all__"


class FlowerbedNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowerbedNote
        fields = "__all__"

class UserFlowerbedStatsSerializer(serializers.Serializer):
    emission_sum = serializers.FloatField()
    emission_sentence = serializers.CharField()
    savings_sum = serializers.FloatField()

class UserFlowerbedSerializer(serializers.ModelSerializer):
    # flowerbed = FlowerbedSerializer(read_only=True)
    user = SmallProfileSerializer(read_only=True)
    harvests = FlowerbedHarvestSerializer(
        source="flowerbedharvest_set", many=True, read_only=True
    )
    notes = FlowerbedNoteSerializer(
        source="flowerbednote_set", many=True, read_only=True
    )

    class Meta:
        model = UserFlowerbed
        fields = "__all__"


class EditFlowerbedNoteSerializer(serializers.ModelSerializer):
    notes = FlowerbedNoteSerializer(source="flowerbednote_set", many=True)

    def update(self, instance, validated_data):
        instance.flowerbednote_set.all().delete()
        if "flowerbednote_set" in validated_data:
            for note in validated_data.get("flowerbednote_set"):
                note.pop("id", None)
                noteInstance = FlowerbedNote.objects.create(
                    **note, user_flowerbed=instance
                )
                noteInstance.save()
        instance.refresh_from_db()

        return instance

    class Meta:
        model = UserFlowerbed
        fields = ["notes"]


class EditFlowerbedHarvestSerializer(serializers.ModelSerializer):
    harvests = FlowerbedHarvestSerializer(source="flowerbedharvest_set", many=True)

    def update(self, instance, validated_data):
        instance.flowerbedharvest_set.all().delete()
        if "flowerbedharvest_set" in validated_data:
            for harvest in validated_data.get("flowerbedharvest_set"):
                harvest.pop("id", None)
                harvestInstance = FlowerbedHarvest.objects.create(
                    **harvest, user_flowerbed=instance
                )
                harvestInstance.save()
        instance.refresh_from_db()

        return instance

    class Meta:
        model = UserFlowerbed
        fields = ["harvests"]

class FlowerbedLocalHarvestSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlowerbedHarvest
        fields = ["name", "quantity"]

class FlowerbedSavingsSerializer(serializers.Serializer):
    harvests = FlowerbedLocalHarvestSerializer(source="flowerbedharvest_set", many=True)
    
    class Meta:
        model = UserFlowerbed
        fields = ["harvests"]
