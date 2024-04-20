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
    # greenhouse_address = GreenhouseAddressSerializer(required=False)
    # greenhouse_business_hours = GreenhouseBusinessHourSerializer(
    #     source="greenhousebusinesshour_set", many=True, required=False
    # )

    class Meta:
        model = Rent
        fields = [
            "rented_from",
            "rented_to",
        ]
        extra_kwargs = {
            "rented_from": {"required": True},
            "rented_to": {"required": True},
        }

    def validate(self, attrs):
        return attrs

    # def update(self, instance, validated_data):
    #     instance.title = validated_data.get("title", instance.title)
    #     instance.description = validated_data.get("description", instance.description)
    #     instance.published = validated_data.get("published", instance.published)
    #     instance.greenhouse_address = GreenhouseAddress.objects.get_or_create(
    #         **validated_data["greenhouse_address"]
    #     )[0]
    #
    #     instance.greenhousebusinesshour_set.all().delete()
    #     if "greenhousebusinesshour_set" in validated_data:
    #         print("NEMAM")
    #         businessHours = validated_data.get("greenhousebusinesshour_set")
    #         print(businessHours)
    #
    #         # TODO: put this above the if later
    #
    #         for businessHour in businessHours:
    #             businessHourInstance = GreenhouseBusinessHour.objects.get_or_create(
    #                 greenhouse=instance, day=businessHour.get("day")
    #             )
    #             businessHourInstance[0].save()
    #             businessHourInstance[0].greenhousebusinesshourperiod_set.all().delete()
    #             for period in businessHour.get("greenhousebusinesshourperiod_set"):
    #                 periodInstance = GreenhouseBusinessHourPeriod.objects.get_or_create(
    #                     business_hour=businessHourInstance[0],
    #                     open=period.get("open"),
    #                     close=period.get("close"),
    #                 )
    #                 periodInstance[0].save()
    #         businessHours = validated_data["greenhousebusinesshour_set"]
    #
    #         instance.greenhousebusinesshour_set.all().delete()
    #
    #         for businessHour in businessHours:
    #             businessHourInstance = GreenhouseBusinessHour.objects.get_or_create(
    #                 greenhouse=instance, day=businessHour.get("day")
    #             )
    #             businessHourInstance[0].save()
    #             businessHourInstance[0].greenhousebusinesshourperiod_set.all().delete()
    #             for period in businessHour.get("greenhousebusinesshourperiod_set"):
    #                 periodInstance = GreenhouseBusinessHourPeriod.objects.get_or_create(
    #                     business_hour=businessHourInstance[0],
    #                     open=period.get("open"),
    #                     close=period.get("close"),
    #                 )
    #                 periodInstance[0].save()
    #
    #     instance.save()
    #     return instance


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
                print(noteInstance)
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
