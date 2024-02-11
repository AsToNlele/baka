from datetime import date

from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from flowerbed.models import Flowerbed
from flowerbed.serializers import (
    CreateRentSerializer,
    FlowerbedSerializer,
    FlowerbedStatusSerializer,
    RentSerializer,
)
from ordering.models import FlowerbedOrders
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import Response


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

        orderedDays = (rentedFrom - rentedTo).days

        finalPrice = flowerbed.pricePerDay * orderedDays

        FlowerbedOrders.objects.create(
            rent=rentItem,
            user=request.user.profile,
            final_price=finalPrice,
        )

        rentItem.refresh_from_db()

        serializedRentItem = RentSerializer(rentItem)
        return Response(serializedRentItem.data, status=200)
