# Create your views here.
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.template import context
from rest_framework import permissions, status
from rest_framework import views
from rest_framework.response import Response

from quickstart.serializers import UserSerializer

from . import serializers


class LoginView(views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(
            data=self.request.data, context={"request": self.request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)


class UserView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        permission_classes = [permissions.IsAuthenticated]
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        permission_classes = [permissions.IsAuthenticated]
        logout(request)
        return Response(status=status.HTTP_200_OK)

class RegisterView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = serializers.RegisterSerializer(
            data=self.request.data, context={"request": self.request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if user:
            serializer = serializers.LoginSerializer(
                data=self.request.data, context={"request": self.request}
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data["user"]
            login(request, user)
            return Response(None, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
