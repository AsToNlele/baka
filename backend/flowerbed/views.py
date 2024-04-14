from datetime import date

from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from flowerbed.models import Flowerbed
from flowerbed.serializers import (
    CreateFlowerbedSerializer,
    CreateRentSerializer,
    EditFlowerbedSerializer,
    FlowerbedSerializer,
    FlowerbedStatusSerializer,
    RentSerializer,
)
from greenhouse.models import Greenhouse
from orders.models import FlowerbedOrders
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import Response
from users.models import Profile


class FlowerbedViewSet(viewsets.ModelViewSet):
    queryset = Flowerbed.objects.all()
    serializer_class = FlowerbedSerializer

    # status endpoint for the flowerbed
    @action(
        detail=True,
        serializer_class=FlowerbedStatusSerializer,
        name="Flowerbed rent status",
    )
    def status(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed)
        status = "rented" if flowerbedSerializer.data.get("currentRent") else "free"
        serializer = self.get_serializer(data={"status": status})
        serializer.is_valid(raise_exception=True)
        return JsonResponse(serializer.data)

        # return Response(
        #     {
        #         "status": "rented" if serializer.data.get("currentRent") else "free",
        #     }
        # )

    @action(
        methods=["post"],
        detail=True,
        serializer_class=CreateRentSerializer,
        name="Rent a flowerbed",
    )
    def rent(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed, many=False)

        # if flowerbedSerializer.data.get("currentRent"):
        #     return Response({"error": "This flowerbed is already rented"}, status=400)

        # Check for conflicts
        conflicts = flowerbed.rent_set.filter(
            rented_from__lte=request.data.get("rented_to"),
            rented_to__gte=request.data.get("rented_from"),
        )

        print(conflicts)
        if conflicts:
            return Response(
                {"error": "This flowerbed is already rented for this period"},
                status=400,
            )

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        print(serializer.data.__dict__)

        rentItem = flowerbed.rent_set.create(
            user=request.user.profile,
            rented_from=serializer.data.get("rented_from"),
            rented_to=serializer.data.get("rented_to"),
        )

        rentedFrom = parse_datetime(rentItem.rented_to)
        rentedTo = parse_datetime(rentItem.rented_from)

        if rentedFrom is None or rentedTo is None:
            return Response({"error": "Invalid date format"}, status=400)

        orderedDays = (rentedFrom - rentedTo).days + 1

        finalPrice = flowerbed.pricePerDay * orderedDays

        FlowerbedOrders.objects.create(
            rent=rentItem,
            user=request.user.profile,
            final_price=finalPrice,
        )

        rentItem.refresh_from_db()

        serializedRentItem = RentSerializer(rentItem)
        return Response(serializedRentItem.data, status=200)

    # Extend rent
    @action(
        methods=["put"],
        detail=True,
        serializer_class=CreateRentSerializer,
        name="Extend rent",
    )
    def extend_rent(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed, many=False)

        currentRent = flowerbedSerializer.data.get("currentRent")
        print(currentRent)
        print(flowerbedSerializer.data)
        if not currentRent:
            return Response({"message": "This flowerbed is not rented"}, status=400)
        currentRentUser = Profile.objects.get(pk=currentRent.get("user"))
        if currentRentUser != request.user.profile:
            return Response(
                {"message": "You are not allowed to extend this rent"}, status=403
            )

        currentRentInstance = flowerbed.rent_set.get(pk=currentRent.get("id"))

        print(currentRentInstance)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        rents = flowerbed.rent_set.all()

        print("RENTS", rents)

        if rents[len(rents) - 1] != currentRentInstance:
            return Response({"message": "Rent is already extended"}, status=400)

        rentedToOriginal = parse_datetime(currentRent.get("rented_to"))

        newRentedFrom = rentedToOriginal
        newRentedTo = parse_datetime(serializer.data.get("rented_to"))

        if newRentedTo is None or newRentedFrom is None:
            return Response({"message": "Invalid date format"}, status=400)

        if newRentedTo <= newRentedFrom:
            return Response(
                {"message": "'To' date must be after 'From' date"}, status=400
            )

        rentItem = flowerbed.rent_set.create(
            user=request.user.profile,
            rented_from=currentRent.get("rented_to"),
            rented_to=serializer.data.get("rented_to"),
        )

        orderedDays = (newRentedTo - newRentedFrom).days + 1
        finalPrice = flowerbed.pricePerDay * orderedDays

        FlowerbedOrders.objects.create(
            rent=rentItem,
            user=request.user.profile,
            final_price=finalPrice,
        )

        rentItem.refresh_from_db()

        serializedRentItem = RentSerializer(rentItem)
        return Response(serializedRentItem.data, status=200)

    @action(
        detail=False,
        methods=["get"],
        name="Get my flowerbeds",
        serializer_class=FlowerbedSerializer,
    )
    def my_flowerbeds(self, request):
        queryset = Flowerbed.objects.filter(rent__user=request.user.profile).distinct()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Override create
    def create(self, request, *args, **kwargs):
        # Get Greenhouse
        greenhouseId = request.data.get("greenhouse")
        greenhouse = get_object_or_404(Greenhouse, pk=greenhouseId)

        # Check if the user is admin, owner or caretaker
        if (
            greenhouse.owner != request.user.profile
            and greenhouse.caretaker != request.user.profile
            and not request.user.is_superuser
            and not request.user.is_staff
        ):
            return Response(
                {
                    "error": "You are not allowed to create a flowerbed in this greenhouse"
                },
                status=403,
            )

        serializer = CreateFlowerbedSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    # Override update
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Check if the user is admin, owner or caretaker
        if (
            instance.greenhouse.owner != request.user.profile
            and instance.greenhouse.caretaker != request.user.profile
            and not request.user.is_superuser
            and not request.user.is_staff
        ):
            return Response(
                {
                    "error": "You are not allowed to update this flowerbed in this greenhouse"
                },
                status=403,
            )

        serializer = EditFlowerbedSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
