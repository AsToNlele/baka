from django.http.response import JsonResponse
from greenhouse.models import Greenhouse
from orders.models import FlowerbedOrders, Order, ProductOrders
from orders.serializers import (
    FlowerbedOrderSerializer,
    GetPickupLocationsSerializer,
    OrderSerializer,
    PaymentSerializer,
    ProductOrderSerializer,
)
from rest_framework import permissions, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import Response


class IsOrderOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user.profile


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [IsAuthenticated]
        elif self.action == "list":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsOrderOwner]
        return [permission() for permission in permission_classes]

    def list(self, request):
        # queryset only owned
        queryset = Order.objects.filter(user=request.user.profile)
        serializer = OrderSerializer(queryset, many=True)
        print(serializer.data)
        orders = []
        for order in serializer.data:
            if order["type"] == "flowerbed":
                flowerbed_order = FlowerbedOrders.objects.get(id=order["id"])
                flowerbed_order_serializer = FlowerbedOrderSerializer(flowerbed_order)
                flowerbedOrder = flowerbed_order_serializer.data
                orders.append(flowerbedOrder)
            else:
                product_order = ProductOrders.objects.get(id=order["id"])
                product_order_serializer = ProductOrderSerializer(product_order)
                productOrder = product_order_serializer.data
                orders.append(productOrder)

        return Response(orders)

    def retrieve(self, request, pk=None):
        # queryset = Order.objects.all()
        # order = get_object_or_404(queryset, pk=pk)
        order = self.get_object()
        # permission_classes = [IsOrderOwner | IsAdminUser]
        # # Only if owner
        # if order.user != request.user.profile:
        #     return JsonResponse({"error": "Unauthorized"}, status=401)

        if hasattr(order, "flowerbedorders"):
            flowerbed_order = FlowerbedOrders.objects.get(id=pk)
            flowerbed_order_serializer = FlowerbedOrderSerializer(flowerbed_order)
            return Response(flowerbed_order_serializer.data)
        else:
            product_order = ProductOrders.objects.get(id=pk)
            product_order_serializer = ProductOrderSerializer(product_order)
            return Response(product_order_serializer.data)

    @action(detail=True, methods=["get"], serializer_class=PaymentSerializer)
    def get_payment(self, request, pk=None):
        order = self.get_object()

        if order.status != "created":
            return Response({"error": "Order is already paid"})
        bankAccountNumber = "2102758516/2010"
        payment_serializer = PaymentSerializer(
            data={
                "vs": order.id,
                "receiver": bankAccountNumber,
                "amount": order.final_price,
            }
        )
        if payment_serializer.is_valid():
            return Response(payment_serializer.data)
        else:
            return Response(payment_serializer.errors)

    @action(detail=True, methods=["get"], serializer_class=GetPickupLocationsSerializer)
    def get_pickup(self, request, pk=None):
        order = self.get_object()
        queryset = ProductOrders.objects.all()
        productOrder = get_object_or_404(queryset, pk=pk)

        if productOrder.user != request.user.profile:
            return JsonResponse({"error": "Unauthorized"}, status=401)

        if not productOrder:
            return Response({"error": "Order not found"})

        class GreenhouseWithItems:
            def __init__(self, greenhouse):
                self.greenhouse = greenhouse
                self.items = []

            def add_item(self, item):
                self.items.append(item)

            def __str__(self):
                return f"{self.greenhouse.title} - {', '.join([item.productName for item in self.items])}"

        greenhousesWithItems = []

        items = productOrder.productorderitems_set.all()

        for item in items:
            greenhouse = Greenhouse.objects.get(id=item.greenhouseId)
            greenhouseWithItems = GreenhouseWithItems(greenhouse)

            isInList = False

            for ghi in greenhousesWithItems:
                if ghi.greenhouse.id == greenhouse.id:
                    ghi.add_item(item)
                    isInList = True
                    break

            if not isInList:
                greenhouseWithItems.add_item(item)
                greenhousesWithItems.append(greenhouseWithItems)

        for greenhouseWithItems in greenhousesWithItems:
            print(len(greenhousesWithItems))
            print(greenhouseWithItems)

        serializer = GetPickupLocationsSerializer(data=greenhousesWithItems, many=True)
        serializer.is_valid()

        return Response(serializer.data)
