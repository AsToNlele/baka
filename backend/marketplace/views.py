# Author: Alexandr Celakovsky - xcelak00
from django.db.models import Q, Sum
from greenhouse.models import Greenhouse
from greenhouse.serializers import EmptySerializer, GreenhouseSerializer
from marketplace.models import MarketplaceProduct, Product, SharedProduct
from marketplace.serializers import (
    CreateGreenhouseProductFromCustomProductSerializer,
    CreateGreenhouseProductFromSharedProductSerializer,
    CreateProductOrderInputSerializer,
    CreateProductOrderOutputSerializer,
    EditMarketplaceProductSerializer,
    MarketplaceDetailProductSerializer,
    MarketplaceProductSerializer,
    ProductDetailMarketplaceProductSerializer,
    ProductMinMaxSerializer,
    ProductSerializer,
    SharedProductSerializer,
)
from orders.models import ProductOrders
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import JsonResponse
from rest_framework.generics import get_object_or_404, mixins
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView, Response
from users.serializers import ProfileSerializer
import geopy.distance


class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request):
        # Only products with existing listings
        queryset = Product.objects.filter(marketplaceproduct__isnull=False).distinct()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["get"],
        serializer_class=ProductDetailMarketplaceProductSerializer,
    )
    def listings(self, request, *args, **kwargs):
        product = get_object_or_404(Product, pk=kwargs["pk"])
        listings = MarketplaceProduct.objects.filter(product=product)
        serializer = ProductDetailMarketplaceProductSerializer(listings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], serializer_class=ProductMinMaxSerializer)
    def minmax(self, request, *args, **kwargs):
        # Add
        product = get_object_or_404(Product, pk=kwargs["pk"])
        listings = MarketplaceProduct.objects.filter(product=product)
        if not listings:
            return JsonResponse(
                {"error": f"Product {product.name} has no listings"},
                status=400,
            )
        id = product.id
        min = listings[0].price
        max = listings[0].price
        totalQuantity = 0
        totalGreenhouses = listings.count()
        for listing in listings:
            totalQuantity += listing.quantity
            if listing.price < min:
                min = listing.price
            if listing.price > max:
                max = listing.price
        serializer = ProductMinMaxSerializer(
            {
                "id": id,
                "name": product.name,
                "description": product.description,
                "image": product.image,
                "min": min,
                "max": max,
                "totalQuantity": totalQuantity,
                "totalGreenhouses": totalGreenhouses,
            }
        )
        return Response(serializer.data)


class GreenhouseProductView(generics.ListAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = MarketplaceProductSerializer
    lookup_field = "pk"

    def get_queryset(self, *args, **kwargs):
        items = super().get_queryset().filter(greenhouse=self.kwargs["pk"])

        return items


class MarketplaceProductView(generics.RetrieveAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = MarketplaceDetailProductSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = "pk"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class RemoveMarketplaceProductImageView(generics.DestroyAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = EmptySerializer
    lookup_field = "pk"
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.product.image = None
        instance.product.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if (
            instance.greenhouse.owner != request.user
            and not request.user.is_staff
            and not instance.greenhouse.caretaker != request.user
        ):
            return JsonResponse(
                {
                    "message": f"User {request.user} is not the owner of greenhouse {instance.greenhouse}"
                },
                status=400,
            )


        self.perform_destroy(instance)
        instance.refresh_from_db()
        responseSerializer = MarketplaceProductSerializer(instance)
        return Response(responseSerializer.data)


class EditMarketplaceProductView(generics.UpdateAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = EditMarketplaceProductSerializer
    lookup_field = "pk"
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if (
            instance.greenhouse.owner != request.user
            and not request.user.is_staff
            and not instance.greenhouse.caretaker != request.user
        ):
            return JsonResponse(
                {
                    "message": f"User {request.user} is not the owner of greenhouse {instance.greenhouse}"
                },
                status=400,
            )

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class DeleteMarketplaceProductView(generics.DestroyAPIView):
    queryset = MarketplaceProduct.objects.all()
    lookup_field = "pk"
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if (
            instance.greenhouse.owner != request.user
            and not request.user.is_staff
            and not request.is_superuser
            and instance.greenhouse.caretaker != request.user
        ):
            return JsonResponse(
                {
                    "message": f"User {request.user} is not the owner of greenhouse {instance.greenhouse}"
                },
                status=400,
            )

        serializer = MarketplaceProductSerializer(instance)
        self.perform_destroy(instance)
        return Response(serializer.data)


class SharedProductViewset(viewsets.ModelViewSet):
    queryset = SharedProduct.objects.filter(shared=True)
    serializer_class = SharedProductSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAdminUser]


class CreateGreenhouseProductFromSharedProductView(generics.CreateAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = CreateGreenhouseProductFromSharedProductSerializer
    lookup_field = "pk"

    def perform_create(self, serializer):
        serializer.save(greenhouse=self.kwargs["pk"])


class CreateGreenhouseProductFromCustomProductView(generics.CreateAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = CreateGreenhouseProductFromCustomProductSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = "pk"

    def perform_create(self, serializer):
        serializer.save(greenhouse=self.kwargs["pk"])


class CreateProductOrderView(generics.CreateAPIView):
    queryset = ProductOrders.objects.all()
    serializer_class = CreateProductOrderInputSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        instance_serializer = CreateProductOrderOutputSerializer(instance)
        return Response(instance_serializer.data)


class EditGreenhouseProductInventoryView(APIView):
    def put(self, request, *args, **kwargs):
        # Get Greenhouse from PK
        greenhouse = get_object_or_404(Greenhouse, pk=kwargs["pk"])
        # Get products from data
        products = request.data.get("products", [])
        for product in products:
            listing = MarketplaceProduct.objects.get(pk=product["id"])
            if listing.greenhouse != greenhouse:
                return JsonResponse(
                    {
                        "message": f"Product {listing.id} is not in greenhouse {greenhouse.id}"
                    },
                    status=400,
                )
            listing.quantity = product["quantity"]
            listing.price = product["price"]
            listing.save()
        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)


class SetPrimaryGreenhouseView(APIView):
    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        profile.primary_greenhouseId = request.data.get("greenhouseId")
        profile.save()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=200)


class GetPickupOptionsFromCartItemsView(APIView):
    def post(self, request, *args, **kwargs):
        items = request.data.get("items", [])
        primaryGreenhouseId = request.data.get("primaryGreenhouseId")
        primaryGreenhouse = None
        try:
            primaryGreenhouse = Greenhouse.objects.get(pk=primaryGreenhouseId)
        except Greenhouse.DoesNotExist:
            primaryGreenhouse = None

        # List of pickup options
        pickupOptions = []

        # Final array of marketplace products
        finalMarketplaceProducts = []

        # Items which have a Greenhouse selected
        lockedLocationProducts = []

        # Items that need to find a correct greenhouse
        products = []
                                  
        # Separate items into lockedLocationProducts and products
        for item in items:
            if item.get("marketplaceProduct"):
                lockedLocationProducts.append(item)
            else:
                products.append(item)

        # Check quantity of lockedLocationProducts
        for item in lockedLocationProducts:
            listing = MarketplaceProduct.objects.get(pk=item["marketplaceProduct"])
            if listing.quantity < item.get("quantity"):
                return JsonResponse(
                    {"error": f"Item {listing.product.name} has not enough quantity"},
                    status=400,
                )

        # Check quantity of products
        for item in products:
            # Get listings of product
            product = Product.objects.get(pk=item["product"])
            total_quantity = MarketplaceProduct.objects.filter(product=product).aggregate(
                total_quantity=Sum("quantity")
            ).get("total_quantity")
            if total_quantity < item.get("quantity"):
                return JsonResponse(
                    {"error": f"Item {product.name} has not enough quantity through all greenhouses"},
                    status=400,
                )

        # Add lockedLocationProducts to finalMarketplaceProducts
        finalMarketplaceProducts.extend(lockedLocationProducts)

        # Greenhouses that have lockedLocationProducts and will be visited
        lockedGreenhouses = []
        for item in lockedLocationProducts:
            listing = MarketplaceProduct.objects.get(pk=item["marketplaceProduct"])
            if listing.greenhouse not in lockedGreenhouses:
                lockedGreenhouses.append(listing.greenhouse)

        # Preferred Greenhouse also counts as a lockedGreenhouse if it exists
        if primaryGreenhouse:
            if primaryGreenhouse not in lockedGreenhouses:
                lockedGreenhouses.append(primaryGreenhouse)
                
        # Products with quantity not available in lockedGreenhouses
        remainingProducts = []

        # Find which products are available and have enough quantity in lockedGreenhouses
        productsInLockedGreenhouses = []

        for item in products:
            product = Product.objects.get(pk=item["product"])
            listings = MarketplaceProduct.objects.filter(Q(product=product) & Q(greenhouse__id__in=[gh.id for gh in lockedGreenhouses]))

            # Sort listings by price
            sortedListings = sorted(listings, key=lambda x: x.price)

            remainingQuantity = item.get("quantity")
            # Try to add as much as possible from lockedGreenhouses
            for listing in sortedListings:
                if listing.quantity >= remainingQuantity:
                    productsInLockedGreenhouses.append({"marketplaceProduct": listing.id, "quantity": remainingQuantity})
                    remainingQuantity = 0
                    break
                else:
                    takenQuantity = 0
                    if listing.quantity >= remainingQuantity:
                        takenQuantity = remainingQuantity
                        remainingQuantity = 0
                    else:
                        takenQuantity = listing.quantity
                        remainingQuantity -= listing.quantity
                        
                    productsInLockedGreenhouses.append(
                        {
                            "marketplaceProduct": listing.id,
                            "quantity": takenQuantity
                        }
                    )
                    

            # The rest of the quantity is not available in lockedGreenhouses
            if remainingQuantity > 0:
                remainingProducts.append({"product": product.id, "quantity": remainingQuantity})
        

        # Find closest greenhouse to preferred greenhouse
        if primaryGreenhouse:
            # If longitude and latitude are set
            if primaryGreenhouse.greenhouse_address and primaryGreenhouse.greenhouse_address.latitude and primaryGreenhouse.greenhouse_address.longitude:
                primaryGreenhouseLatitude = primaryGreenhouse.greenhouse_address.latitude
                primaryGreenhouseLongitude = primaryGreenhouse.greenhouse_address.longitude
                
                # Exclude lockedGreenhouses and primaryGreenhouse
                possibleGreenhouses = Greenhouse.objects.exclude(id__in=[gh.id for gh in lockedGreenhouses]).exclude(id=primaryGreenhouse.id).all()

                # List of Greenhousese with distance
                greenhousesWithDistance = []

                # Get distance from primaryGreenhouse to all possibleGreenhouses
                for greenhouse in possibleGreenhouses:
                    if greenhouse.greenhouse_address and greenhouse.greenhouse_address.latitude and greenhouse.greenhouse_address.longitude:
                        distance = geopy.distance.geodesic((primaryGreenhouseLatitude, primaryGreenhouseLongitude), (greenhouse.greenhouse_address.latitude, greenhouse.greenhouse_address.longitude)).km
                        greenhousesWithDistance.append([greenhouse.id, distance])

                sortedGreenhousesWithDistance = sorted(greenhousesWithDistance, key=lambda x: x[1])

                # Go through closest greenhouses
                for greenhouse in sortedGreenhousesWithDistance:

                    # Go through remainingProducts
                    for product in remainingProducts:
                        # Check if product is available in greenhouse
                        listing = MarketplaceProduct.objects.filter(Q(product=product["product"]) & Q(greenhouse=greenhouse[0])).first()
                        if listing:
                            # Take all quantity if available
                            if listing.quantity >= product["quantity"]:
                                productsInLockedGreenhouses.append({"marketplaceProduct": listing.id, "quantity": product["quantity"]})
                                remainingProducts.remove(product)
                                break
                            # Take as much as possible
                            else:
                                if listing.quantity > 0:
                                    takenQuantity = listing.quantity
                                    remainingQuantity = product["quantity"] - takenQuantity
                                    productsInLockedGreenhouses.append({"marketplaceProduct": listing.id, "quantity": takenQuantity})
                                    # Subtract taken quantity from product quantity
                                    product["quantity"] = remainingQuantity
                                        
        # Merge found products to finalMarketplaceProducts
        finalMarketplaceProducts.extend(productsInLockedGreenhouses)

        # If there are still remainingProducts, stop and exclude Ideal Pickup
        if len(remainingProducts) == 0:
            idealPickupOption = {
                "title": "Ideal Pickup",
                "items": finalMarketplaceProducts,
                "sum": sum([MarketplaceProduct.objects.get(pk=item["marketplaceProduct"]).price * item["quantity"] for item in finalMarketplaceProducts])
            }
            pickupOptions.append(idealPickupOption)

        

        # Cheapest pickup option
        lockedLocationProducts = []
        products = []
        for item in items:
            if item.get("marketplaceProduct"):
                lockedLocationProducts.append(item)
            else:
                products.append(item)

        cheapestPickupOptionItems = []
        cheapestItemsSum = 0

        # Return early if no products to check
        if len(products) == 0:
            return JsonResponse(pickupOptions, status=200, safe=False)
        
        # Go through every product
        for item in products:
            product = Product.objects.get(pk=item["product"])
            listings = MarketplaceProduct.objects.filter(product=product)

            # Sort listings by price
            listings = sorted(listings, key=lambda x: x.price)

            remainingQuantity = item.get("quantity")

            for listing in listings:
                # Get all listings with enough quantity
                if listing.quantity >= remainingQuantity:
                    cheapestPickupOptionItems.append(
                        {"marketplaceProduct": listing.id, "quantity": remainingQuantity}
                    )
                    cheapestItemsSum += listing.price * remainingQuantity
                    remainingQuantity = 0
                    break
                # If not available in this listing, get as much as possible
                else:
                    takenquantity = 0
                    if listing.quantity >= remainingQuantity:
                        takenquantity = remainingQuantity
                        remainingQuantity = 0
                    else:
                        takenquantity = listing.quantity
                        remainingQuantity -= listing.quantity
                        
                    cheapestPickupOptionItems.append(
                        {
                            "marketplaceProduct": listing.id,
                            "quantity": takenquantity
                        }
                    )
                    cheapestItemsSum += takenquantity * listing.price



        # Calculate sum of locked items
        for item in lockedLocationProducts:
            product = MarketplaceProduct.objects.get(pk=item["marketplaceProduct"])
            cheapestItemsSum += product.price * item["quantity"]
            cheapestPickupOptionItems.append(item)

        cheapestPickupOption = {
            "title": "Cheapest pickup",
            "items": cheapestPickupOptionItems,
            "sum": cheapestItemsSum,
        }
        
        if len(pickupOptions) == 0:
            pickupOptions.append(cheapestPickupOption)
        else:
            if pickupOptions[0]["sum"] > cheapestItemsSum:
                pickupOptions.append(cheapestPickupOption)
            
        return JsonResponse(pickupOptions, status=200, safe=False)
