# Author: Alexandr Celakovsky - xcelak00
from datetime import date

from django.db.models import Count, F, Sum
from greenhouse.serializers import FlowerbedStatisticsSerializer, GreenhouseStatisticsSerializer, ProductStatisticsSerializer
from orders.models import FlowerbedOrders, ProductOrderItems, ProductOrders


def get_monthly_report(greenhouse, month, year):
    ###### Product Orders ######

    # In how many orders was the greenhouse involved
    productOrderCount = ProductOrders.objects.filter(
            created_at__month=month,
            created_at__year=year,
            status="paid",
            productorderitems__greenhouseId=greenhouse.id,
        ).distinct().count()

    # Get comparison between statuses
    productOrderStatusComparison = productOrders = (
        ProductOrders.objects.filter(
            created_at__month=month,
            created_at__year=year,
            # status='paid',
            productorderitems__greenhouseId=greenhouse.id,
        )
        .distinct()
        .values("status")
        .annotate(count=Count("status"))
    )

    # Get all product order items for the greenhouse
    productOrderItems = ProductOrderItems.objects.filter(
        greenhouseId=greenhouse.id,
        productOrder__created_at__month=month,
        productOrder__created_at__year=year,
        productOrder__status="paid",
    )

    # Get most popular products
    productOrderItemsPopularity = (
        productOrderItems.values("productName")
        .annotate(total_quantity=Sum("quantity"))
        .order_by("-total_quantity")
    )

    # Get count of items sold
    productOrderItemsCount = productOrderItems.count()

    # Get product turnover
    productOrderItemsTotal = productOrderItems.aggregate(
        total=Sum(F("price") * F("quantity"))
    )["total"] or 0

    # Get count of customers for products
    productOrderCustomerCount = (
        productOrderItems.values("productOrder__user").distinct().count()
    )

    productSerializer = ProductStatisticsSerializer(data={
        "total_spend": productOrderItemsTotal,
        "total_orders": productOrderCount,
        "total_customers": productOrderCustomerCount,
        "popular_products": productOrderItemsPopularity,
        "total_products": productOrderItemsCount,
    })
    productSerializer.is_valid()

    ###### Flowerbed Orders ######
    flowerbedOrders = FlowerbedOrders.objects.filter(
        created_at__month=month,
        created_at__year=year,
        status="paid",
        rent__flowerbed__greenhouse=greenhouse.id,
    ).distinct()

    flowerbedOrderCount = flowerbedOrders.count()

    flowerbedOrderTotal = flowerbedOrders.aggregate(total=Sum("final_price"))["total"] or 0

    currentFlowerbedsCount = greenhouse.flowerbed_set.count()
    occupiedFlowerbedsCount = 0
    for flowerbed in greenhouse.flowerbed_set.all():
        currentRent = flowerbed.rent_set.filter(
            rented_from__lte=date.today(), rented_to__gte=date.today()
        ).first()
        if currentRent:
            occupiedFlowerbedsCount += 1

    flowerbedSerializer = FlowerbedStatisticsSerializer(data={
        "total_spend": flowerbedOrderTotal,
        "total_orders": flowerbedOrderCount,
        "total_flowerbeds": currentFlowerbedsCount,
        "occupied_flowerbeds": occupiedFlowerbedsCount,
    })
    flowerbedSerializer.is_valid()

        
    flowerbedOrdersStatusComparison = flowerbedOrders.values("status").annotate(
        count=Count("status")
    )

    # Merge status comparisons to one dict
    statusComparison = [
        {"status": "cancelled", "count": 0},
        {"status": "paid", "count": 0},
        {"status": "created", "count": 0},
    ]
    for status in productOrderStatusComparison:
        if status["status"] == "cancelled":
            statusComparison[0]["count"] += status["count"]
        elif status["status"] == "paid":
            statusComparison[1]["count"] += status["count"]
        elif status["status"] == "created":
            statusComparison[2]["count"] += status["count"]
    for status in flowerbedOrdersStatusComparison:
        if status["status"] == "cancelled":
            statusComparison[0]["count"] += status["count"]
        elif status["status"] == "paid":
            statusComparison[1]["count"] += status["count"]
        elif status["status"] == "created":
            statusComparison[2]["count"] += status["count"]

    total = productOrderItemsTotal + flowerbedOrderTotal

    statsSerializer = GreenhouseStatisticsSerializer(data={
        "total_spend": total,
        "flowerbed_stats": flowerbedSerializer.data,
        "product_stats": productSerializer.data,
        "total_status_comparison": statusComparison,
    })

    statsSerializer.is_valid()
    
    

    return statsSerializer
