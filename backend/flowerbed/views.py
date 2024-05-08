from datetime import date

from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from flowerbed.models import Flowerbed, UserFlowerbed
from flowerbed.serializers import (
    CreateFlowerbedSerializer,
    CreateRentSerializer,
    EditFlowerbedHarvestSerializer,
    EditFlowerbedNoteSerializer,
    EditFlowerbedSerializer,
    FlowerbedSavingsSerializer,
    FlowerbedSerializer,
    FlowerbedStatusSerializer,
    RentSerializer,
    UserFlowerbedSerializer,
    UserFlowerbedStatsSerializer,
)
from flowerbed.service import get_emission_stats, get_savings_stats
from greenhouse.models import Greenhouse
from greenhouse.serializers import EmptySerializer
from orders.models import Discount, FlowerbedOrders
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import Response
from rest_framework.permissions import IsAuthenticated
from users.models import Profile


class FlowerbedViewSet(viewsets.ModelViewSet):
    queryset = Flowerbed.objects.all()
    serializer_class = FlowerbedSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Only Admin,Owner,Caretaker if disabled, else 403
        if (
            instance.disabled
            and not request.user.is_superuser
            and not request.user.is_staff
            and not request.user.profile == instance.greenhouse.owner
            and not request.user.profile == instance.greenhouse.caretaker
        ):
            return Response({"message": "This flowerbed is disabled"}, status=403)

        # If current renter is not the user, return 403
        if (
            not request.user.is_superuser
            and not request.user.is_staff
            and not request.user.profile == instance.greenhouse.owner
            and not request.user.profile == instance.greenhouse.caretaker
        ):
            flowerbedSerializer = FlowerbedSerializer(instance, many=False)

            currentRent = flowerbedSerializer.data.get("currentRent")
            if currentRent:
                # return Response({"message": "This flowerbed is not rented"}, status=400)
                currentRentUser = Profile.objects.get(pk=currentRent.get("user"))
                if currentRentUser != request.user.profile:
                    return Response(
                        {"message": "You are not renting this flowerbed"}, status=403
                    )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

    @action(
        methods=["post"],
        detail=True,
        serializer_class=CreateRentSerializer,
        name="Rent a flowerbed",
    )
    def rent(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed, many=False)

        # Check for conflicts
        conflicts = flowerbed.rent_set.filter(
            rented_from__lte=request.data.get("rented_to"),
            rented_to__gte=request.data.get("rented_from"),
        )

        if conflicts:
            return Response(
                {"error": "This flowerbed is already rented for this period"},
                status=400,
            )

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        rentItem = flowerbed.rent_set.create(
            user=request.user.profile,
            rented_from=serializer.data.get("rented_from"),
            rented_to=serializer.data.get("rented_to"),
        )

        rentedFrom = parse_datetime(rentItem.rented_to)
        rentedTo = parse_datetime(rentItem.rented_from)

        if rentedFrom is None or rentedTo is None:
            return Response({"error": "Invalid date format"}, status=400)

        # Check discount code
        discount_code = serializer.validated_data.get("discount_code")
        discount_found = Discount.objects.filter(
            code=discount_code, valid_to__gte=date.today()
        ).first()
        discount_value = 0
        if discount_found:
            # Check if the discount has been used
            if discount_found.order_set.all().count() > 0:
                return Response(
                    {"error": "Discount code has already been used"}, status=400
                )
            discount_value = discount_found.discount_value

        orderedDays = (rentedFrom - rentedTo).days + 1

        finalPrice = flowerbed.pricePerDay * orderedDays - discount_value
        if finalPrice < 0:
            finalPrice = 0

        finalStatus = "created" if finalPrice > 0 else "paid"

        FlowerbedOrders.objects.create(
            rent=rentItem,
            user=request.user.profile,
            final_price=finalPrice,
            status=finalStatus,
            discount=discount_found,
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

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        rents = flowerbed.rent_set.all()

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

        # Check discount code
        discount_code = serializer.validated_data.get("discount_code")
        discount_found = Discount.objects.filter(
            code=discount_code, valid_to__gte=date.today()
        ).first()
        discount_value = 0
        if discount_found:
            # Check if the discount has been used
            if discount_found.order_set.all().count() > 0:
                return Response(
                    {"error": "Discount code has already been used"}, status=400
                )
            discount_value = discount_found.discount_value

        rentItem = flowerbed.rent_set.create(
            user=request.user.profile,
            rented_from=currentRent.get("rented_to"),
            rented_to=serializer.data.get("rented_to"),
        )

        orderedDays = (newRentedTo - newRentedFrom).days + 1
        finalPrice = flowerbed.pricePerDay * orderedDays - discount_value
        if finalPrice < 0:
            finalPrice = 0
        finalStatus = "created" if finalPrice > 0 else "paid"

        FlowerbedOrders.objects.create(
            rent=rentItem,
            user=request.user.profile,
            final_price=finalPrice,
            status=finalStatus,
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
        queryset = Flowerbed.objects.filter(
            rent__user=request.user.profile,
            rent__rented_to__gte=date.today(),
            rent__rented_from__lte=date.today(),
        ).distinct()
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

    @action(
        detail=True,
        methods=["get"],
        name="Get current details",
        serializer_class=UserFlowerbedSerializer,
        permission_classes=[IsAuthenticated],
    )
    def get_current_details(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed)
        currentRent = flowerbedSerializer.data.get("currentRent")
        if not currentRent:
            return Response({"message": "This flowerbed is not rented"}, status=404)
        currentRentUser = Profile.objects.get(pk=currentRent.get("user"))
        if currentRentUser != request.user.profile and not request.user.is_superuser:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )

        # Create userFlowerbed if not exists
        try:
            userFlowerbed = flowerbed.userflowerbed_set.get(user=request.user.profile)
        except UserFlowerbed.DoesNotExist:
            userFlowerbed = UserFlowerbed.objects.create(
                user=request.user.profile, flowerbed=flowerbed
            )
        serializer = UserFlowerbedSerializer(userFlowerbed)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["get"],
        name="Get stats",
        serializer_class=UserFlowerbedStatsSerializer,
        permission_classes=[IsAuthenticated],
    )
    def get_stats(self, request, pk=None):
        flowerbed = self.get_object()
        profile = request.user.profile

        # Get userFlowerbed
        try:
            userFlowerbed = flowerbed.userflowerbed_set.get(user=profile)
        except UserFlowerbed.DoesNotExist:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )

        # Calculate emissions

        (emissionSum, comparisonSentence) = get_emission_stats(userFlowerbed)
        print("Emission sum: ", emissionSum)
        print("Comparison sentence: ", comparisonSentence)

        savingsSum = get_savings_stats(userFlowerbed)
        print("Savings sum: ", savingsSum)


        serializer = UserFlowerbedStatsSerializer(
            data={
                "emission_sum": emissionSum,
                "emission_sentence": comparisonSentence,
                "savings_sum": savingsSum,
            }
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["put"],
        name="Set notes",
        serializer_class=EditFlowerbedNoteSerializer,
        permission_classes=[IsAuthenticated],
    )
    def set_notes(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed)
        currentRent = flowerbedSerializer.data.get("currentRent")
        if not currentRent:
            return Response({"message": "This flowerbed is not rented"}, status=404)
        currentRentUser = Profile.objects.get(pk=currentRent.get("user"))
        if currentRentUser != request.user.profile and not request.user.is_superuser:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )
        try:
            userFlowerbed = flowerbed.userflowerbed_set.get(user=request.user.profile)
        except UserFlowerbed.DoesNotExist:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )

        serializer = EditFlowerbedNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(userFlowerbed, serializer.validated_data)

        userFlowerbed.refresh_from_db()
        userFlowerbedSerializer = UserFlowerbedSerializer(userFlowerbed)

        return Response(userFlowerbedSerializer.data)

    # Set Harvest
    @action(
        detail=True,
        methods=["put"],
        name="Set harvests",
        serializer_class=EditFlowerbedHarvestSerializer,
        permission_classes=[IsAuthenticated],
    )
    def set_harvests(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed)
        currentRent = flowerbedSerializer.data.get("currentRent")
        if not currentRent:
            return Response({"message": "This flowerbed is not rented"}, status=404)
        currentRentUser = Profile.objects.get(pk=currentRent.get("user"))
        if currentRentUser != request.user.profile and not request.user.is_superuser:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )
        try:
            userFlowerbed = flowerbed.userflowerbed_set.get(user=request.user.profile)
        except UserFlowerbed.DoesNotExist:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )

        serializer = EditFlowerbedHarvestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(userFlowerbed, serializer.validated_data)

        userFlowerbed.refresh_from_db()
        userFlowerbedSerializer = UserFlowerbedSerializer(userFlowerbed)

        
        (emissionSum, _) = get_emission_stats(userFlowerbed)

        return Response(userFlowerbedSerializer.data)

    # Get Savings
    @action(
        detail=True,
        methods=["post"],
        name="Get savings",
        serializer_class=FlowerbedSavingsSerializer,
        permission_classes=[IsAuthenticated],
    )
    def get_savings(self, request, pk=None):
        flowerbed = self.get_object()
        flowerbedSerializer = FlowerbedSerializer(flowerbed)
        currentRent = flowerbedSerializer.data.get("currentRent")
        if not currentRent:
            return Response({"message": "This flowerbed is not rented"}, status=404)
        currentRentUser = Profile.objects.get(pk=currentRent.get("user"))
        if currentRentUser != request.user.profile and not request.user.is_superuser:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )
        try:
            userFlowerbed = flowerbed.userflowerbed_set.get(user=request.user.profile)
        except UserFlowerbed.DoesNotExist:
            return Response(
                {"message": "You are not renting this flowerbed"}, status=403
            )

        serializer = FlowerbedSavingsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        localHarvests = serializer.data.get("harvests")

        # for harvest in localHarvests:

        return Response(serializer.data)
