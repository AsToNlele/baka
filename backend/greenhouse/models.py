from django.db import models
from rest_framework.fields import timezone
from users.models import Profile


class GreenhouseBusinessHourPeriod(models.Model):
    business_hour = models.ForeignKey(
        "GreenhouseBusinessHour", models.CASCADE, blank=True, null=True
    )
    open = models.TimeField(null=False)
    close = models.TimeField(null=False)

    class Meta:
        db_table = "greenhouse_business_hour_periods"


class GreenhouseBusinessHour(models.Model):
    greenhouse = models.ForeignKey("Greenhouse", models.CASCADE, blank=True, null=True)
    day = models.IntegerField(null=False)

    class Meta:
        db_table = "greenhouse_business_hours"


class GreenhouseAddress(models.Model):
    country = models.CharField(blank=True, null=True, default="CZ")
    state = models.CharField(blank=True, null=True)
    city = models.CharField(blank=True, null=True, default="Brno")
    city_part = models.CharField(blank=True, null=True)
    street = models.CharField(blank=True, null=True)
    zipcode = models.CharField(blank=True, null=True)
    latitude = models.CharField(blank=True, null=True)
    longitude = models.CharField(blank=True, null=True)

    class Meta:
        db_table = "greenhouse_address"


class GreenhouseImage(models.Model):
    greenhouse = models.ForeignKey(
        "Greenhouse", models.DO_NOTHING, blank=True, null=True
    )
    image = models.CharField(blank=True, null=True)

    class Meta:
        db_table = "greenhouse_images"


def greenhouse_upload_to(instance, filename):
    return f"greenhouse-images/{filename}"


class Greenhouse(models.Model):
    title = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True, db_comment="Description")
    owner = models.ForeignKey(
        Profile, models.DO_NOTHING, blank=True, null=True, related_name="owner"
    )
    rules = models.CharField(blank=True, null=True)
    greenhouse_address = models.OneToOneField(
        GreenhouseAddress, models.DO_NOTHING, blank=True, null=True
    )
    published = models.BooleanField(default=True, blank=False, null=False)
    caretaker = models.ForeignKey(
        Profile, models.DO_NOTHING, blank=True, null=True, related_name="caretaker"
    )
    bank_account_number = models.CharField(blank=True, null=True)

    image = models.ImageField(
        upload_to=greenhouse_upload_to,
        blank=True,
        null=True,
        width_field="image_width",
        height_field="image_height",
    )
    image_width = models.PositiveIntegerField(default=0)
    image_height = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "greenhouses"


class Timesheet(models.Model):
    greenhouse = models.ForeignKey(
        "Greenhouse", models.DO_NOTHING, blank=True, null=True
    )
    title = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    pay = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(default="submitted", blank=True, null=True)
    author = models.ForeignKey(
        Profile, models.DO_NOTHING, blank=True, null=True, related_name="author"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "timesheets"


class TimesheetItem(models.Model):
    timesheet = models.ForeignKey("Timesheet", models.DO_NOTHING, blank=True, null=True)
    timesheet_update = models.ForeignKey(
        "TimesheetUpdate", models.DO_NOTHING, blank=True, null=True
    )
    title = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    # hours = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "timesheet_items"


class TimesheetUpdate(models.Model):
    timesheet = models.ForeignKey("Timesheet", models.DO_NOTHING, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    pay = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(default="submitted", blank=True, null=True)
    author = models.ForeignKey(
        Profile, models.DO_NOTHING, blank=True, null=True, related_name="update_author"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "timesheet_updates"


class TimesheetWorkingHour(models.Model):
    timesheet = models.ForeignKey("Timesheet", models.DO_NOTHING, blank=True, null=True)
    timesheet_update = models.ForeignKey(
        "TimesheetUpdate", models.DO_NOTHING, blank=True, null=True
    )
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "timesheet_working_hours"
