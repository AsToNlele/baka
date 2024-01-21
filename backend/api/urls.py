from django.urls import include, path
from rest_framework import routers
from greenhouse.views import GreenhouseViewSet
from quickstart import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"profiles", views.ProfileViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"books", views.BookViewSet)
router.register(r"greenhouses", GreenhouseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("auth.urls"), name="auth"),
]
