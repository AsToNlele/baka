from django.db import transaction
from greenhouse.models import Greenhouse
from marketplace.models import MarketplaceProduct, Product, SharedProduct
from orders.models import ProductOrderItems, ProductOrders
from orders.serializers import ProductOrderItemSerializer
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


class MarketplaceDetailProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
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


class ProductOrderItemInputSerializer(serializers.Serializer):
    marketplaceProduct = serializers.PrimaryKeyRelatedField(
        queryset=MarketplaceProduct.objects.all()
    )
    quantity = serializers.IntegerField()

    def validate(self, attrs):
        if attrs["quantity"] > attrs["marketplaceProduct"].quantity:
            raise serializers.ValidationError("Not enough items in stock")
        return attrs


class CreateProductOrderInputSerializer(serializers.ModelSerializer):
    items = serializers.ListField(child=ProductOrderItemInputSerializer())

    class Meta:
        model = ProductOrders
        fields = ["items"]

    def create(self, validated_data):
        try:
            with transaction.atomic():
                items = validated_data.get("items")
                productOrder = ProductOrders.objects.create(
                    user=self.context["request"].user.profile, status="created"
                )
                finalPrice = 0
                for item in items:
                    newItem = ProductOrderItems.objects.create(
                        productOrder=productOrder,
                        quantity=item["quantity"],
                        price=item["marketplaceProduct"].price,
                        greenhouseName=item["marketplaceProduct"].greenhouse.title,
                        productName=item["marketplaceProduct"].product.name,
                    )
                    item["marketplaceProduct"].quantity -= newItem.quantity
                    item["marketplaceProduct"].save()
                    finalPrice += newItem.price * newItem.quantity

                productOrder.refresh_from_db()
                productOrder.final_price = finalPrice
                productOrder.save()

                return productOrder
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Error creating order, rollback")


class CreateProductOrderOutputSerializer(serializers.ModelSerializer):
    items = ProductOrderItemSerializer(many=True, source="productorderitems_set")

    class Meta:
        model = ProductOrders
        fields = "__all__"
