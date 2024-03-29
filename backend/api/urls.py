from django.urls import include, path
from rest_framework import routers
from greenhouse.views import GreenhouseViewSet
from orders.views import OrderViewSet
from flowerbed.views import FlowerbedViewSet
from users import views

router = routers.DefaultRouter()
router.register(r"profiles", views.ProfileViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"greenhouses", GreenhouseViewSet)
router.register(r"flowerbeds", FlowerbedViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"users", views.UserViewSet)
# router.register(r"marketplace", MarketplaceView)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("auth.urls"), name="auth"),
    path("marketplace/", include("marketplace.urls"), name="marketplace"),
]
