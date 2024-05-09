# Author: Alexandr Celakovsky - xcelak00
from datetime import date, datetime

from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.utils.timezone import datetime as djangodatetime
from flowerbed.serializers import FlowerbedSerializer
from greenhouse.models import (
    Greenhouse,
    GreenhouseAddress,
    GreenhouseBusinessHour,
    GreenhouseBusinessHourPeriod,
    Timesheet,
    TimesheetItem,
    TimesheetUpdate,
    TimesheetWorkingHour,
)
from rest_framework import serializers
from users.models import Profile

class SmallProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Profile
        fields = ["id", "user"]

class GreenhouseUploadImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=True, use_url=False)

    class Meta:
        model = Greenhouse
        fields = ["image", "image_height", "image_width"]

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
    image = serializers.ImageField(required=False, use_url=False)

    def get_available_flowerbeds(self, obj):
        flowerbeds = obj.flowerbed_set.all()
        availableCount = 0
        for flowerbed in flowerbeds:
            currentRent = flowerbed.rent_set.filter(
                rented_from__lte=date.today(), rented_to__gte=date.today()
            ).first()
            if currentRent is None:
                availableCount += 1
        return availableCount

    class Meta:
        model = Greenhouse
        fields = "__all__"


class CreateGreenhouseSerializer(serializers.ModelSerializer):
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
            "greenhouse_address": {"required": True},
        }

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        try:
            with transaction.atomic():
                greenhouse_address = GreenhouseAddress.objects.create(
                    **validated_data["greenhouse_address"]
                )
                greenhouse = Greenhouse.objects.create(
                    title=validated_data.get("title"),
                    description=validated_data.get("description"),
                    published=validated_data.get("published"),
                    greenhouse_address=greenhouse_address,
                )

                businessHours = validated_data.get("greenhousebusinesshour_set")
                if businessHours is not None:
                    for businessHour in businessHours:
                        businessHourInstance = GreenhouseBusinessHour.objects.create(
                            greenhouse=greenhouse, day=businessHour.get("day")
                        )
                        for period in businessHour.get("greenhousebusinesshourperiod_set"):
                            periodInstance = GreenhouseBusinessHourPeriod.objects.create(
                                business_hour=businessHourInstance,
                                open=period.get("open"),
                                close=period.get("close"),
                            )
                            periodInstance.save()

                return greenhouse
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Error creating greenhouse, rollback")

class EditGreenhouseSerializer(serializers.ModelSerializer):
    greenhouse_address = GreenhouseAddressSerializer(required=False)
    greenhouse_business_hours = GreenhouseBusinessHourSerializer(
        source="greenhousebusinesshour_set", many=True, required=False
    )

    class Meta:
        model = Greenhouse
        fields = [
            "id",
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
            businessHours = validated_data.get("greenhousebusinesshour_set")

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


class SetCaretakerSerializer(serializers.Serializer):
    caretaker = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())


class SetOwnerSerializer(serializers.Serializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())


class TimesheetWorkingHourSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        # Check if start is before end
        if attrs["start"] >= attrs["end"]:
            raise serializers.ValidationError("Start time must be before end time")
        # Check if not in future
        if attrs["start"] > timezone.now():
            raise serializers.ValidationError("Start time must be in the past")
        return attrs

    class Meta:
        model = TimesheetWorkingHour
        fields = "__all__"




class TimesheetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimesheetItem
        fields = "__all__"


class TimesheetUpdateSerializer(serializers.ModelSerializer):
    items = TimesheetItemSerializer(source="timesheetitem_set", many=True)
    working_hours = TimesheetWorkingHourSerializer(
        source="timesheetworkinghour_set", many=True
    )
    author = SmallProfileSerializer()

    class Meta:
        model = TimesheetUpdate
        fields = "__all__"


class TimesheetSerializer(serializers.ModelSerializer):
    items = TimesheetItemSerializer(source="timesheetitem_set", many=True)

    class Meta:
        model = Timesheet
        fields = "__all__"


class CreateTimesheetSerializer(serializers.ModelSerializer):
    items = TimesheetItemSerializer(many=True)
    greenhouse = serializers.PrimaryKeyRelatedField(queryset=Greenhouse.objects.all())
    working_hours = TimesheetWorkingHourSerializer(many=True)

    class Meta:
        model = Timesheet
        fields = [
            "items",
            "greenhouse",
            "working_hours",
            "title",
            "description",
            "pay",
            "status",
        ]

    def create(self, validated_data):
        try:
            with transaction.atomic():
                items = validated_data.get("items")
                working_hours = validated_data.get("working_hours")
                status = "submitted"

                # To avoid duplicate titles for the same day in the same greenhouse a number is added to the title
                today = date.today()
                formatted_date = today.strftime("%d.%m.%Y")
                greenhouse = validated_data.get("greenhouse")
                existingTitleCount = Timesheet.objects.filter(
                    title__contains=formatted_date, greenhouse=greenhouse
                ).count()
                if existingTitleCount > 0:
                    formatted_date = formatted_date + " #" + str(existingTitleCount + 1)

                # Create Timesheet
                timesheet = Timesheet.objects.create(
                    greenhouse=validated_data.get("greenhouse"),
                    title=formatted_date,
                    description=validated_data.get("description"),
                    pay=validated_data.get("pay"),
                    status=status,
                    author=self.context["request"].user.profile,
                )
                # Create initial Update
                timesheetUpdate = TimesheetUpdate.objects.create(
                    timesheet=timesheet,
                    message="Timesheet created",
                    description=timesheet.description,
                    pay=timesheet.pay,
                    status="submitted",
                    author=self.context["request"].user.profile,
                )
                # Create Items and add them to Timesheet and Update
                for item in items:
                    newItem = TimesheetItem.objects.create(
                        timesheet=timesheet,
                        timesheet_update=timesheetUpdate,
                        title=item.get("title"),
                        description=item.get("description"),
                        # hours
                    )
                    newItem.save()

                # Create Working Hours and add them to Timesheet and Update
                for working_hour in working_hours:
                    newWorkingHour = TimesheetWorkingHour.objects.create(
                        timesheet=timesheet,
                        timesheet_update=timesheetUpdate,
                        start=working_hour.get("start"),
                        end=working_hour.get("end"),
                    )
                    newWorkingHour.save()

                return timesheet
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Error creating timesheet, rollback")


class UpdateTimesheetSerializer(serializers.ModelSerializer):
    items = TimesheetItemSerializer(many=True, required=False)
    working_hours = TimesheetWorkingHourSerializer(many=True, required=False)
    message = serializers.CharField(write_only=True, allow_blank=True, required=False)

    class Meta:
        model = Timesheet
        fields = ["items", "working_hours", "message", "description", "pay", "status"]

    def update(self, instance, validated_data):
        try:
            with transaction.atomic():
                if instance.status == "cancelled":
                    raise serializers.ValidationError(
                        "Cancelled timesheet cannot be updated"
                    )
                if validated_data.get("status") == "cancelled":
                    # Cancel
                    new_status = validated_data.get("status")
                    message = validated_data.get("message")
                    new_update = TimesheetUpdate.objects.create(
                        timesheet=instance,
                        message=message,
                        status=new_status,
                        author=self.context["request"].user.profile,
                    )
                    instance.status = new_status
                elif instance.status == "submitted":
                    # Approve or reject
                    new_status = validated_data.get("status")
                    if new_status != "approved" and new_status != "rejected":
                        raise serializers.ValidationError("Invalid status")

                    message = validated_data.get("message")
                    new_update = TimesheetUpdate.objects.create(
                        timesheet=instance,
                        message=message,
                        status=new_status,
                        author=self.context["request"].user.profile,
                    )
                    instance.status = new_status
                    instance.save()
                    return instance
                elif instance.status == "rejected":
                    # Resubmit

                    items = validated_data.get("items")
                    working_hours = validated_data.get("working_hours")
                    description = validated_data.get("description")
                    pay = validated_data.get("pay")
                    message = validated_data.get("message")
                    new_status = ""
                    if validated_data.get("status") == "submitted":
                        new_status = "submitted"
                    else:
                        raise serializers.ValidationError(
                            "Rejected timesheet can be only resubmitted or cancelled"
                        )

                    # Unset all items and working hours from timesheet
                    prev_items = instance.timesheetitem_set.all()
                    for item in prev_items:
                        item.timesheet = None
                        item.save()

                    prev_working_hours = instance.timesheetworkinghour_set.all()
                    for working_hour in prev_working_hours:
                        working_hour.timesheet = None
                        working_hour.save()

                    # Create new update
                    new_update = TimesheetUpdate.objects.create(
                        timesheet=instance,
                        message=message,
                        description=description,
                        pay=pay,
                        status=new_status,
                        author=instance.author,
                    )
                    # Create Items and add them to Timesheet and Update
                    for item in items:
                        newItem = TimesheetItem.objects.create(
                            timesheet=instance,
                            timesheet_update=new_update,
                            title=item.get("title"),
                            description=item.get("description"),
                            # hours
                        )
                        newItem.save()

                    # Create Working Hours and add them to Timesheet and Update
                    for working_hour in working_hours:
                        newWorkingHour = TimesheetWorkingHour.objects.create(
                            timesheet=instance,
                            timesheet_update=new_update,
                            start=working_hour.get("start"),
                            end=working_hour.get("end"),
                        )
                        newWorkingHour.save()

                    instance.status = new_status
                    instance.pay = pay
                    instance.message = "Timesheet resubmitted"

                else:
                    raise serializers.ValidationError("Invalid status")

                instance.save()
                return instance
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Error updating timesheet, rollback")


class TimesheetWithGreenhouseSerializer(serializers.ModelSerializer):
    items = TimesheetItemSerializer(source="timesheetitem_set", many=True)
    greenhouse = GreenhouseSerializer()
    working_hours = TimesheetWorkingHourSerializer(
        source="timesheetworkinghour_set", many=True
    )
    updates = TimesheetUpdateSerializer(source="timesheetupdate_set", many=True)
    author = SmallProfileSerializer()

    class Meta:
        model = Timesheet
        fields = "__all__"


class EmptySerializer(serializers.Serializer):
    pass

class FlowerbedStatisticsSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    total_spend = serializers.FloatField()
    occupied_flowerbeds = serializers.IntegerField()
    total_flowerbeds = serializers.IntegerField()

class ProductStatisticsSerializer(serializers.Serializer):
    total_spend = serializers.FloatField()
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    popular_products = serializers.ListField()
    total_products = serializers.IntegerField()

class StatusComparisonSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()

class GreenhouseStatisticsSerializer(serializers.Serializer):
    total_spend = serializers.FloatField()
    flowerbed_stats = FlowerbedStatisticsSerializer()
    product_stats = ProductStatisticsSerializer()
    total_status_comparison = StatusComparisonSerializer(many=True)

    
