from rest_framework import serializers
from greenhouse.models import Greenhouse

from marketplace.models import MarketplaceProduct, Product, SharedProduct


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class MarketplaceProductGreenhouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Greenhouse
        fields = "__all__"

class ProductDetailMarketplaceProductSerializer(serializers.ModelSerializer):
    greenhouse = MarketplaceProductGreenhouseSerializer()
    class Meta:
        model = MarketplaceProduct
        fields = "__all__"

class MarketplaceProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = MarketplaceProduct
        fields = "__all__"


class SharedProductSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return SharedProduct.objects.create(**validated_data, shared=True)
    
    class Meta:
        model = SharedProduct
        fields = "__all__"
        read_only_fields = ["shared"]
