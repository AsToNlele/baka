from django.urls import include, path
from rest_framework import routers
from greenhouse.views import GreenhouseViewSet
from orders.views import OrderViewSet
from quickstart import views
from flowerbed.views import FlowerbedViewSet

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"profiles", views.ProfileViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"books", views.BookViewSet)
router.register(r"greenhouses", GreenhouseViewSet)
router.register(r"flowerbeds", FlowerbedViewSet)
router.register(r"orders", OrderViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("auth.urls"), name="auth"),
]
