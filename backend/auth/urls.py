from django.urls import path
from rest_framework import urlpatterns

from . import views


urlpatterns = [
    path("login", views.LoginView.as_view(), name="login"),
    path("register", views.RegisterView.as_view(), name="register"),
    path("profile", views.UserView.as_view(), name="user"),
    path("logout", views.LogoutView.as_view(), name="logout"),
]
