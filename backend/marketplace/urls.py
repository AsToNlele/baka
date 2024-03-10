from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"products", views.ProductViewset)
router.register(r"shared-products", views.SharedProductViewset)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "greenhouses/<pk>/products/",
        views.GreenhouseProductView.as_view(),
        name="greenhouse-products",
    ),
    path(
        "greenhouses/<pk>/products/from-shared/",
        views.CreateGreenhouseProductFromSharedProductView.as_view(),
        name="create-greenhouse-product-from-shared",
    ),
    path(
        "greenhouses/<pk>/products/from-custom/",
        views.CreateGreenhouseProductFromCustomProductView.as_view(),
        name="create-greenhouse-product-from-custom",
    ),
    path("order/", views.CreateProductOrderView.as_view(), name="create-product-order"),
    path(
        "product/<pk>/",
        views.MarketplaceProductView.as_view(),
        name="marketplace-product",
    ),
]
