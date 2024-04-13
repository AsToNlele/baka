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
        "marketplace-products/<pk>/",
        views.EditMarketplaceProductView.as_view(),
        name="edit-marketplace-product",
    ),
    path(
        "marketplace-products/<pk>/delete/",
        views.DeleteMarketplaceProductView.as_view(),
        name="delete-marketplace-product",
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
    path(
        "greenhouses/<pk>/products/edit/",
        views.EditGreenhouseProductInventoryView.as_view(),
        name="edit-greenhouse-product-inventory",
    ),
    path("order/", views.CreateProductOrderView.as_view(), name="create-product-order"),
    path(
        "product/<pk>/",
        views.MarketplaceProductView.as_view(),
        name="marketplace-product",
    ),
    path("pickup-options/", views.GetPickupOptionsFromCartItemsView.as_view(), name="pickup-options"),
    path("set-primary-greenhouse/", views.SetPrimaryGreenhouseView.as_view(), name="set-primary-greenhouse"),
]
