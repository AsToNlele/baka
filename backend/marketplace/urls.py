from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"products", views.ProductViewset)
router.register(r"shared-products", views.SharedProductViewset)
# router.register(r"greenhouses/(?P<pk>\d+)/products", views.GreenhouseProductView, basename="greenhouse-products")

urlpatterns = [
    path("", include(router.urls)),
    path("greenhouses/<pk>/products", views.GreenhouseProductView.as_view(), name="greenhouse-products")
    # path("login", views.LoginView.as_view(), name="login"),
]
