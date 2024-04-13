from datetime import datetime

from flowerbed.models import Flowerbed, Rent
from greenhouse.models import Greenhouse, GreenhouseAddress
from orders.serializers import FlowerbedOrderSerializer
from rest_framework import serializers

# from greenhouse.serializers import GreenhouseAddressSerializer


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

    class Meta:
        model = Greenhouse
        fields = ["id", "title", "description", "greenhouse_address"]


class FlowerbedSerializer(serializers.ModelSerializer):
    rents = RentFlowerbedSerializer(source="rent_set", many=True, read_only=True)
    currentRent = serializers.SerializerMethodField()
    greenhouse = GreenhouseFlowerSerializer()

    def get_currentRent(self, obj):
        # Get the current lease for this flowerbed
        # If there is no current lease, return None
        currentRent = obj.rent_set.filter(
            rented_from__lte=datetime.now(), rented_to__gte=datetime.now()
        ).first()
        return RentSerializer(currentRent).data if currentRent else None

    class Meta:
        model = Flowerbed
        fields = "__all__"


class CreateFlowerbedSerializer(serializers.ModelSerializer):
    greenhouse = serializers.PrimaryKeyRelatedField(queryset=Greenhouse.objects.all())

    class Meta:
        model = Flowerbed
        fields = "__all__"
