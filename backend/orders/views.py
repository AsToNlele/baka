from greenhouse.models import Greenhouse
from orders.models import FlowerbedOrders, Order, ProductOrders
from orders.serializers import (
    FlowerbedOrderSerializer,
    OrderSerializer,
    PaymentSerializer,
    ProductOrderSerializer,
)
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.views import Response


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    # def get_serializer_class(self):
    #     if hasattr(self, 'action') and self.action == 'list':
    #         return OrderSerializer

    def list(self, request):
        queryset = Order.objects.all()
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
        queryset = Order.objects.all()
        order = get_object_or_404(queryset, pk=pk)
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
        order = Order.objects.get(id=pk)
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
