from datetime import datetime

from flowerbed.serializers import FlowerbedSerializer
from greenhouse.models import (
    Greenhouse,
    GreenhouseAddress,
    GreenhouseBusinessHour,
    GreenhouseBusinessHourPeriod,
)
from quickstart.models import Profile
from rest_framework import serializers


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


class GreenhouseAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseAddress
        fields = "__all__"


class GreenhouseSerializer(serializers.ModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer()
    flowerbeds = FlowerbedSerializer(source="flowerbed_set", many=True, read_only=True)
    greenhouse_business_hours = GreenhouseBusinessHourSerializer(
        source="greenhousebusinesshour_set", many=True
    )
    available_flowerbeds = serializers.SerializerMethodField()

    def get_available_flowerbeds(self, obj):
        flowerbeds = obj.flowerbed_set.all()
        availableCount = 0
        for flowerbed in flowerbeds:
            currentRent = flowerbed.rent_set.filter(
                rented_from__lte=datetime.now(), rented_to__gte=datetime.now()
            ).first()
            if currentRent is None:
                availableCount += 1
        return availableCount

    class Meta:
        model = Greenhouse
        fields = "__all__"


class EditGreenhouseSerializer(serializers.ModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer(required=False)
    greenhouse_business_hours = GreenhouseBusinessHourSerializer(
        source="greenhousebusinesshour_set", many=True, required=False
    )

    class Meta:
        model = Greenhouse
        fields = [
            "title",
            "description",
            "published",
            "greenhouse_address",
            "greenhouse_business_hours",
        ]
        extra_kwargs = {
            "title": {"required": True},
            "description": {"required": True},
            "published": {"required": True},
        }

    def validate(self, attrs):
        return attrs

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.published = validated_data.get("published", instance.published)
        instance.greenhouse_address = GreenhouseAddress.objects.get_or_create(
            **validated_data["greenhouse_address"]
        )[0]

        instance.greenhousebusinesshour_set.all().delete()
        if "greenhousebusinesshour_set" in validated_data:
            print("NEMAM")
            businessHours = validated_data.get("greenhousebusinesshour_set")
            print(businessHours)

            # TODO: put this above the if later

            for businessHour in businessHours:
                businessHourInstance = GreenhouseBusinessHour.objects.get_or_create(
                    greenhouse=instance, day=businessHour.get("day")
                )
                businessHourInstance[0].save()
                businessHourInstance[0].greenhousebusinesshourperiod_set.all().delete()
                for period in businessHour.get("greenhousebusinesshourperiod_set"):
                    periodInstance = GreenhouseBusinessHourPeriod.objects.get_or_create(
                        business_hour=businessHourInstance[0],
                        open=period.get("open"),
                        close=period.get("close"),
                    )
                    periodInstance[0].save()
            businessHours = validated_data["greenhousebusinesshour_set"]

            instance.greenhousebusinesshour_set.all().delete()

            for businessHour in businessHours:
                businessHourInstance = GreenhouseBusinessHour.objects.get_or_create(
                    greenhouse=instance, day=businessHour.get("day")
                )
                businessHourInstance[0].save()
                businessHourInstance[0].greenhousebusinesshourperiod_set.all().delete()
                for period in businessHour.get("greenhousebusinesshourperiod_set"):
                    periodInstance = GreenhouseBusinessHourPeriod.objects.get_or_create(
                        business_hour=businessHourInstance[0],
                        open=period.get("open"),
                        close=period.get("close"),
                    )
                    periodInstance[0].save()

        instance.save()
        return instance


# class GreenhouseCareTakerSerializer(serializers.ModelSerializer):
#     caretaker = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), required=True)
#
#     class Meta:
#         model = Greenhouse
#         fields = ["caretaker"]
#
#     def validate(self, attrs):
#         return attrs
