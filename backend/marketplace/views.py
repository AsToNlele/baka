from marketplace.models import MarketplaceProduct, Product, SharedProduct
from marketplace.serializers import (
    CreateGreenhouseProductFromCustomProductSerializer,
    CreateGreenhouseProductFromSharedProductSerializer,
    MarketplaceProductSerializer,
    ProductDetailMarketplaceProductSerializer,
    ProductSerializer,
    SharedProductSerializer,
)
from rest_framework import generics, viewsets
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
