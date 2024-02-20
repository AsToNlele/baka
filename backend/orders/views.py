from orders.models import FlowerbedOrders, Order
from orders.serializers import FlowerbedOrderSerializer, OrderSerializer
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

        return Response(orders)

    def retrieve(self, request, pk=None):
        queryset = Order.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        if hasattr(order, "flowerbedorders"):
            flowerbed_order = FlowerbedOrders.objects.get(id=pk)
            flowerbed_order_serializer = FlowerbedOrderSerializer(flowerbed_order)
            return Response(flowerbed_order_serializer.data)
        else:
            serializer = OrderSerializer(order)
            return Response(serializer.data)
