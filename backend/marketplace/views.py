from marketplace.models import MarketplaceProduct, Product, SharedProduct
from marketplace.serializers import (
    CreateGreenhouseProductFromCustomProductSerializer,
    CreateGreenhouseProductFromSharedProductSerializer,
    CreateProductOrderInputSerializer,
    CreateProductOrderOutputSerializer,
    MarketplaceDetailProductSerializer,
    MarketplaceProductSerializer,
    ProductDetailMarketplaceProductSerializer,
    ProductSerializer,
    SharedProductSerializer,
)
from orders.models import ProductOrders
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404, mixins
from rest_framework.views import Response


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
