from django.db.models import Q
from greenhouse.models import Greenhouse, GreenhouseAddress, Timesheet
from greenhouse.permissions.isOwner import IsOwner
from greenhouse.permissions.isOwnerOrCaretaker import (
    IsOwnerOrAuthorTimesheet,
    IsOwnerOrCaretaker,
)
from greenhouse.serializers import (
    CreateGreenhouseSerializer,
    CreateTimesheetSerializer,
    EditGreenhouseSerializer,
    EmptySerializer,
    GreenhouseAddressSerializer,
    GreenhouseSerializer,
    SetCaretakerSerializer,
    SetOwnerSerializer,
    TimesheetSerializer,
    TimesheetWithGreenhouseSerializer,
    UpdateTimesheetSerializer,
)
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated


class GreenhouseAddressViewSet(viewsets.ModelViewSet):
    queryset = GreenhouseAddress.objects.all()
    serializer_class = GreenhouseAddressSerializer


class GreenhouseViewSet(viewsets.ModelViewSet):
    queryset = Greenhouse.objects.all()
    serializer_class = GreenhouseSerializer

    # Override create
    def create(self, request, *args, **kwargs):
        return Response({"message": "Not allowed"}, status=405)

    # Override update
    def update(self, request, *args, **kwargs):
        return Response({"message": "Not allowed"}, status=405)

    def list(self, request, *args, **kwargs):
        if request.user.is_superuser or request.user.is_staff:
            queryset = Greenhouse.objects.all()
        else:
            queryset = Greenhouse.objects.filter(Q(owner=request.user.profile) | Q(caretaker=request.user.profile) | Q(published=True))
        serializer = GreenhouseSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.published and not request.user.is_superuser and not request.user.is_staff and instance.owner != request.user.profile and instance.caretaker != request.user.profile:
            return Response({"message": "Not found"}, status=404)
        serializer = GreenhouseSerializer(instance)
        return Response(serializer.data)

    # Create Greenhouse
    @action(
        methods=["post"],
        detail=False,
        serializer_class=CreateGreenhouseSerializer,
        name="Create Greenhouse",
        permission_classes=[IsAuthenticated, IsAdminUser],
    )
    def create_greenhouse(self, request):
        serializer = CreateGreenhouseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        gh = serializer.save()
        ghSerializer = GreenhouseSerializer(gh)

        return Response(ghSerializer.data, status=201)
        

    # Edit few fields of the greenhouse
    @action(
        methods=["put"],
        detail=True,
        serializer_class=EditGreenhouseSerializer,
        name="Edit greenhouse",
        permission_classes=[IsAuthenticated, IsOwnerOrCaretaker],
    )
    def edit_greenhouse(self, request, pk=None):
        # Call the permission class
        self.check_object_permissions(request, self.get_object())

        instance = get_object_or_404(Greenhouse.objects.all(), pk=pk)
        serializer = self.get_serializer(instance, data=request.data, required=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)

        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Set caretaker",
        serializer_class=SetCaretakerSerializer,
        permission_classes=[IsAuthenticated, IsOwner],
    )
    def set_caretaker(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin or caretaker
        # if not request.user.is_superuser and greenhouse.owner != request.user.profile:
        #     return Response(
        #         {"message": "You are not allowed to set a caretaker"}, status=403
        #     )

        serializer = SetCaretakerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        caretaker_id = serializer.data.get("caretaker")
        greenhouse.caretaker_id = caretaker_id
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Unset caretaker",
        serializer_class=EmptySerializer,
        permission_classes=[IsAuthenticated, IsOwnerOrCaretaker],
    )
    def unset_caretaker(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin or caretaker
        # if (
        #     not request.user.is_superuser
        #     and greenhouse.owner != request.user.profile
        #     and greenhouse.caretaker != request.user.profile
        # ):
        #     return Response(
        #         {"message": "You are not allowed to unset a caretaker"}, status=403
        #     )

        greenhouse.caretaker = None
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Set owner",
        serializer_class=SetOwnerSerializer,
        permission_classes=[IsAuthenticated, IsOwnerOrCaretaker],
    )
    def set_owner(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin
        if not request.user.is_superuser:
            return Response(
                {"message": "You are not allowed to set an owner"}, status=403
            )

        serializer = SetOwnerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        owner_id = serializer.data.get("owner")
        greenhouse.owner_id = owner_id
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Unset owner",
        serializer_class=EmptySerializer,
        permission_classes=[IsAuthenticated, IsOwner],
    )
    def unset_owner(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin or caretaker
        # if not request.user.is_superuser and greenhouse.owner != request.user.profile:
        #     return Response(
        #         {"message": "You are not allowed to unset an owner"}, status=403
        #     )

        greenhouse.owner = None
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    # Get Timesheets for the greenhouse
    @action(
        detail=True,
        methods=["get"],
        name="Get Timesheets",
        serializer_class=TimesheetSerializer,
        permission_classes=[IsAuthenticated, IsOwnerOrCaretaker],
    )
    def get_timesheets(self, request, pk=None):
        greenhouse = self.get_object()
        # If admin, caretaker or owner
        # if (
        #     not request.user.is_superuser
        #     and greenhouse.owner != request.user.profile
        #     and greenhouse.caretaker != request.user.profile
        # ):
        #     return Response(
        #         {"message": "You are not allowed to view timesheets"}, status=403
        #     )

        timesheets = Timesheet.objects.filter(greenhouse=greenhouse)
        print(timesheets)
        serializer = TimesheetSerializer(timesheets, many=True)
        return Response(serializer.data, status=200)

    # My Greenhouses (Caretaker or owner)
    @action(
        detail=False,
        methods=["get"],
        name="My Greenhouses",
        serializer_class=GreenhouseSerializer,
        permission_classes=[IsAuthenticated],
    )
    def my_greenhouses(self, request):
        queryset = Greenhouse.objects.filter(
            Q(owner=request.user.profile) | Q(caretaker=request.user.profile)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TimesheetViewSet(viewsets.ModelViewSet):
    queryset = Timesheet.objects.all()
    serializer_class = TimesheetWithGreenhouseSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAuthorTimesheet]

    def list(self, request, *args, **kwargs):
        if request.user.is_superuser or request.user.is_staff:
            queryset = Timesheet.objects.all()
        else:
            queryset = Timesheet.objects.filter(
                Q(greenhouse__owner=request.user.profile)
                # | Q(greenhouse__caretaker=request.user.profile)
                | Q(author=request.user.profile)
            )
        serializer = TimesheetWithGreenhouseSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = TimesheetWithGreenhouseSerializer(instance)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        name="Create Timesheet",
        serializer_class=CreateTimesheetSerializer,
        permission_classes=[IsAuthenticated],
    )
    def create_timesheet(self, request, *args, **kwargs):
        # Check if user is Caretaker of Greenhouse
        # greenhouse = Greenhouse.objects.get(pk=request.data["greenhouse"])
        greenhouse = get_object_or_404(
            Greenhouse.objects.all(), pk=request.data["greenhouse"]
        )
        if greenhouse.caretaker != request.user.profile:
            return Response(
                {"message": "You are not allowed to create a timesheet"}, status=403
            )

        serializer = CreateTimesheetSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()

        response_serializer = TimesheetWithGreenhouseSerializer(serializer.instance)

        return Response(response_serializer.data, status=201)

    @action(
        detail=True,
        methods=["put"],
        name="Update Timesheet",
        serializer_class=UpdateTimesheetSerializer,
        permission_classes=[IsAuthenticated, IsOwnerOrAuthorTimesheet],
    )
    def update_timesheet(self, request, *args, **kwargs):
        instance = self.get_object()

        # Owner can approve or reject timesheet
        if instance.status == "submitted":
            if instance.greenhouse.owner != request.user.profile:
                return Response(
                    {"message": "You are not allowed to update this timesheet"},
                    status=403,
                )
        else:
            if instance.author != request.user.profile:
                return Response(
                    {"message": "You are not allowed to update this timesheet"},
                    status=403,
                )

        serializer = UpdateTimesheetSerializer(
            instance, data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        # Since timesheet is created, we update with .save(), calls update method in serializer
        serializer.save()
        timesheetSerializer = TimesheetWithGreenhouseSerializer(instance)
        return Response(timesheetSerializer.data, status=200)
