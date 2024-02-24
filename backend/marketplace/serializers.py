from greenhouse.models import Greenhouse
from marketplace.models import MarketplaceProduct, Product, SharedProduct
from rest_framework import serializers


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


class CreateGreenhouseProductFromSharedProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(shared=True)
    )

    class Meta:
        model = MarketplaceProduct
        fields = ["product", "price", "quantity"]
        read_only_fields = ["greenhouse"]

    def create(self, validated_data):
        greenhouse = Greenhouse.objects.get(pk=self.context["view"].kwargs["pk"])
        product = validated_data["product"]
        print(product.__dict__)
        print(validated_data)
        # product = Product.objects.get(id=product["id"])
        return MarketplaceProduct.objects.create(
            product=product,
            greenhouse=greenhouse,
            price=validated_data["price"],
            quantity=validated_data["quantity"],
        )


class CreateGreenhouseProductFromCustomProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = MarketplaceProduct
        fields = ["product", "price", "quantity"]
        read_only_fields = ["greenhouse"]

    def create(self, validated_data):
        greenhouse = Greenhouse.objects.get(pk=self.context["view"].kwargs["pk"])
        product = Product.objects.create(
            name=validated_data["product"]["name"],
            description=validated_data["product"]["description"],
            image=validated_data["product"]["image"],
            shared=False,
        )
        return MarketplaceProduct.objects.create(
            product=product,
            greenhouse=greenhouse,
            price=validated_data["price"],
            quantity=validated_data["quantity"],
        )
