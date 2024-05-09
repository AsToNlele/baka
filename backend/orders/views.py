import os
from datetime import datetime
from django.http.response import JsonResponse
from django.utils import timezone
from dotenv import load_dotenv
from greenhouse.models import Greenhouse
from greenhouse.serializers import EmptySerializer
from marketplace.models import MarketplaceProduct
from orders.models import Discount, FlowerbedOrders, Order, ProductOrders
from orders.serializers import (
    EditOrderSerializer,
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
from rest_framework.views import APIView, Response

load_dotenv()


class IsOrderOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user.profile or request.user.is_staff or request.user.is_superuser

class DiscountCodeAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        code = request.data.get("code") or None
        if not code:
            return JsonResponse({"error": "Discount code not provided"}, status=400)
        discount = Discount.objects.filter(code=code).first()
        if not discount:
            return JsonResponse({"error": "Discount code not found"}, status=404)
        if discount.valid_from > timezone.now():
            return JsonResponse({"error": "Discount code not valid yet"}, status=400)
        if discount.valid_to < timezone.now():
            return JsonResponse({"error": "Discount code expired"}, status=400)
        if discount.order_set.all().count() > 0:
            return JsonResponse({"error": "Discount code already used"}, status=400)
        return JsonResponse({"discount_value": discount.discount_value, "code": discount.code})


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

    def delete(self, request, *args, **kwargs):
        return JsonResponse({"error": "Method not allowed"}, status=405)

    def list(self, request):
        # queryset only owned
        if request.user.is_staff:
            queryset = Order.objects.all().order_by("-created_at")
        else:
            queryset = Order.objects.filter(user=request.user.profile).order_by("-created_at")
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

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        order = self.get_object()

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
        bankAccountNumber = os.getenv("BANK_ACCOUNT_NUMBER")
        bankIBAN = os.getenv("BANK_IBAN")
        payment_serializer = PaymentSerializer(
            data={
                "vs": order.id,
                "receiver": bankAccountNumber,
                "receiver_iban": bankIBAN,
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

        if productOrder.user != request.user.profile and not request.user.is_staff and not request.user.is_superuser:
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

    @action(detail=True, methods=["put"], serializer_class=EditOrderSerializer)
    def edit_order(self, request, pk=None):
        if not request.user.is_staff:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        order = self.get_object()
        serializer = EditOrderSerializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        orderSerializer = OrderSerializer(order)
        return Response(orderSerializer.data)

    @action(detail=True, methods=["put"], serializer_class=EmptySerializer)
    def cancel_order(self, request, pk=None):
        order = self.get_object()

        if order.user != request.user.profile and not request.user.is_staff and not request.user.is_superuser:
            return JsonResponse({"error": "Unauthorized"}, status=403)

        if order.status == "cancelled":
            return Response({"message": "Order is already cancelled"}, status=400)

        # If user is not admin, check if 1 hour has passed since order creation
        if not request.user.is_staff or not request.user.is_superuser:
            diff = (datetime.now(timezone.utc) - order.created_at)
            if (diff.seconds > 3600):
                return Response({"error": "Order can't be cancelled after 1 hour"}, status=400)
        
        

        # Flowerbed order = cancel rent
        if hasattr(order, "flowerbedorders"):
            print("FLOWERBEDORDER")
            flowerbedOrder = FlowerbedOrders.objects.get(id=pk)
            print(flowerbedOrder)
            print(flowerbedOrder.rent)
            if flowerbedOrder.rent:
                deletedRent = flowerbedOrder.rent.delete()
                print(deletedRent)
                print("DELETED RENT")
            order.refresh_from_db()
            order.status = "cancelled"
            order.save()

        # Product order = cancel order and try to restore stock
        else:
            print("PRODUCTORDER")
            productOrder = ProductOrders.objects.get(id=pk)
            print(productOrder)
            print(productOrder.__dict__)
            for item in productOrder.productorderitems_set.all():
                print(item)
                print(item.productId)
                print(item.__dict__)
                if item.marketplaceProductId:
                    product = None
                    try:
                        product = MarketplaceProduct.objects.get(id=item.marketplaceProductId)
                        product.quantity += item.quantity
                        product.save()
                    except MarketplaceProduct.DoesNotExist:
                        print("Product not found")
                        product = None
            order.refresh_from_db()
            order.status = "cancelled"
            order.save()
                    
        orderSerializer = OrderSerializer(order)
        return Response(orderSerializer.data)
