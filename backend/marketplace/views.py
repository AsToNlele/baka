from rest_framework.parsers import FormParser, MultiPartParser
from greenhouse.models import Greenhouse
from greenhouse.serializers import EmptySerializer, GreenhouseSerializer
from marketplace.models import MarketplaceProduct, Product, SharedProduct
from marketplace.serializers import (
    CreateGreenhouseProductFromCustomProductSerializer,
    CreateGreenhouseProductFromSharedProductSerializer,
    CreateProductOrderInputSerializer,
    CreateProductOrderOutputSerializer,
    EditGreenhouseProductInventorySerializer,
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
from rest_framework.views import APIView, Response
from users.serializers import ProfileSerializer


class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request):
        # Only products with existing listings
        queryset = Product.objects.filter(marketplaceproduct__isnull=False)
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
            print("Primary Greenhouse:", primaryGreenhouse.title)
            print("Primary Greenhouse ID:", primaryGreenhouseId)
        except Greenhouse.DoesNotExist:
            print("Primary greenhouse not found, continuing...")
            primaryGreenhouse = None

        print("Items:", items)

        lockedLocationProducts = []
        products = []
        for item in items:
            if item.get("marketplaceProduct"):
                lockedLocationProducts.append(item)
            else:
                products.append(item)

        print("Locked Location Products:", lockedLocationProducts)
        print("Products:", products)

        # Get greenhouses from lockedLocationProducts
        lockedGreenhouses = []
        for item in lockedLocationProducts:
            print(item)
            product = MarketplaceProduct.objects.get(id=item["marketplaceProduct"])
            if product:
                if product.greenhouse not in lockedGreenhouses:
                    print("Greenhoise id:", product.greenhouse.id)
                    lockedGreenhouses.append(product.greenhouse)

        print("Locked greenhouses", lockedGreenhouses)
        for item in lockedGreenhouses:
            print(item.id)

        # Get greenhouses for each product
        # greenhousesPerProduct = []
        # for item in products:
        #     product = Product.objects.get(pk=item["product"])
        #     listings = MarketplaceProduct.objects.filter(product=product)
        #     tempGreenhouses = []
        #     for listing in listings:
        #         tempGreenhouses.append(listing.greenhouse)
        #     greenhousesPerProduct.append(tempGreenhouses)

        # Find which products are available in lockedGreenhouses
        productsInLockedGreenhouses = []
        productsNotInLockedGreenhouses = []
        convertedProductsToMarketplaceProducts = []
        for item in products:
            product = Product.objects.get(pk=item["product"])
            listings = MarketplaceProduct.objects.filter(product=product)
            appended = False
            for listing in listings:
                if listing.greenhouse in lockedGreenhouses:
                    productsInLockedGreenhouses.append(product)
                    convertedProductsToMarketplaceProducts.append([item, listing])
                    appended = True
                    break

            # Check primaryGreenhouse
            if appended == False:
                if primaryGreenhouse:
                    print("Checking primaryGreenhouse")
                    if primaryGreenhouse not in lockedGreenhouses:
                        for listing in listings:
                            if listing.greenhouse == primaryGreenhouse:
                                print("Picked primary greenhouse")
                                productsInLockedGreenhouses.append(product)
                                print("Adding Primary greenhouse to locked greenhouses")
                                lockedGreenhouses.append(primaryGreenhouse)
                                convertedProductsToMarketplaceProducts.append(
                                    [item, listing]
                                )
                                appended = True
                                break
            if not appended:
                print("Product not available in locked greenhouses")
                productsNotInLockedGreenhouses.append([item, product])

        print("PRODUCTSLOCKED", productsInLockedGreenhouses)
        print("PRODUCSTS", products)

        allProductsInLockedGreenhouses = False

        if len(productsInLockedGreenhouses) == len(products):
            print("All products available in locked greenhouses or primaryGreenhouse")
            allProductsInLockedGreenhouses = True

        if not allProductsInLockedGreenhouses:
            print("Not all products available in locked greenhouses")
            for [item, product] in productsNotInLockedGreenhouses:
                print(item)
                print(product.name, f"{item.get('quantity')}x")
                listings = MarketplaceProduct.objects.filter(product=product)

                # TODO Find nearest greenhouse
                # TODO Find cheapest greenhouse

                foundListing = False
                for listing in listings:
                    if listing.quantity >= item.get("quantity"):
                        print("Available at", listing.greenhouse.title)
                        print("Price:", listing.price)
                        print("Quantity:", listing.quantity)
                        convertedProductsToMarketplaceProducts.append([item, listing])
                        foundListing = True
                        break

                if not foundListing:
                    print("Not available in any greenhouse")
                    return JsonResponse(
                        {"error": f"Item {product.name} has nowhere enough quantity"},
                        status=400,
                    )

        # Handle convertedProductsToMarketplaceProducts
        print("Converted products to marketplace products")
        nextMarketplaceProducts = []
        for [item, listing] in convertedProductsToMarketplaceProducts:
            print(item)
            print(listing)
            print(listing.greenhouse.title)
            print("-----")
            nextMarketplaceProducts.append(
                {"marketplaceProduct": listing.id, "quantity": item.get("quantity")}
            )

        pickupOptions = []
        idealPickupOptionItems = []
        idealPickupOptionItems.extend(lockedLocationProducts)
        idealPickupOptionItems.extend(nextMarketplaceProducts)
        print("Ideal pickup option items", idealPickupOptionItems)

        sum = 0
        for item in idealPickupOptionItems:
            product = MarketplaceProduct.objects.get(pk=item["marketplaceProduct"])
            sum += product.price * item["quantity"]

        currentPickupOption = {
            "title": "Ideal pickup",
            "items": idealPickupOptionItems,
            "sum": sum,
        }
        pickupOptions.append(currentPickupOption)

        return JsonResponse(pickupOptions, status=200, safe=False)
