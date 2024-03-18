from marketplace.models import MarketplaceProduct, Product, SharedProduct
from marketplace.serializers import (
    CreateGreenhouseProductFromCustomProductSerializer,
    CreateGreenhouseProductFromSharedProductSerializer,
    CreateProductOrderInputSerializer,
    CreateProductOrderOutputSerializer,
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
from rest_framework.generics import get_object_or_404, mixins
from rest_framework.views import APIView, Response


class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

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
    lookup_field = "pk"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class SharedProductViewset(viewsets.ModelViewSet):
    queryset = SharedProduct.objects.filter(shared=True)
    serializer_class = SharedProductSerializer


class CreateGreenhouseProductFromSharedProductView(generics.CreateAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = CreateGreenhouseProductFromSharedProductSerializer
    lookup_field = "pk"

    def perform_create(self, serializer):
        serializer.save(greenhouse=self.kwargs["pk"])


class CreateGreenhouseProductFromCustomProductView(generics.CreateAPIView):
    queryset = MarketplaceProduct.objects.all()
    serializer_class = CreateGreenhouseProductFromCustomProductSerializer
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


class GetPickupOptionsFromCartItemsView(APIView):
    def post(self, request, *args, **kwargs):
        lockedLocationProducts = request.data.get("marketplace-products", [])
        # { "marketplaceProduct": 1, "quantity": 1 }
        products = request.data.get("products", [])
        # { "product": 1, "quantity": 1 }

        # Get greenhouses from lockedLocationProducts
        lockedGreenhouses = []
        for item in lockedLocationProducts:
            # print(item)
            # print(item["marketplaceProduct"])
            product = MarketplaceProduct.objects.get(id=item["marketplaceProduct"])
            if product:
                print(product)
                print("IFFF")
                if product.greenhouse not in lockedGreenhouses:
                    print("Greenhoise id:", product.greenhouse.id)
                    lockedGreenhouses.append(product.greenhouse)

        print(lockedGreenhouses)

        # Get greenhouses for each product
        greenhousesPerProduct = []
        for item in products:
            product = Product.objects.get(pk=item["product"])
            listings = MarketplaceProduct.objects.filter(product=product)
            tempGreenhouses = []
            for listing in listings:
                tempGreenhouses.append(listing.greenhouse)
            greenhousesPerProduct.append(tempGreenhouses)

        # Find which products are available in lockedGreenhouses
        productsInLockedGreenhouses = []
        for item in products:
            product = Product.objects.get(pk=item["product"])
            listings = MarketplaceProduct.objects.filter(product=product)
            for listing in listings:
                if listing.greenhouse in lockedGreenhouses:
                    productsInLockedGreenhouses.append(product)
                    break

        print("PRODUCTSLOCKED", productsInLockedGreenhouses)
        print("PRODUCSTS", products)

        if len(productsInLockedGreenhouses) == 0:
            print("No products available in locked greenhouses")
        elif len(productsInLockedGreenhouses) != len(products):
            print("Not all products available in locked greenhouses")
        else:
            print("All products available in locked greenhouses")
            # TODO: kCheck if quantity is available in locked greenhouses

            # Find the cheapest listings and convert product to marketplace product
            cheapestListings = []
            for product in productsInLockedGreenhouses:
                listings = MarketplaceProduct.objects.filter(product=product)
                cheapest = listings[0]
                for listing in listings:
                    if listing.price < cheapest.price:
                        cheapest = listing
                cheapestListings.append(cheapest)
            print(cheapestListings)

        #
        # for item in cart_items:
        #     product = Product.objects.get(pk=item["product"])
        #     pickup_options.append(product)
        # serializer = ProductSerializer(data=pickup_options, many=True)
        # serializer.is_valid()

        return Response("hello")
