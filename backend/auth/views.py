# Author: Alexandr Celakovsky - xcelak00
from datetime import datetime
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.template import context
from rest_framework import permissions, status
from rest_framework import views, serializers
from rest_framework.response import Response
from badges.service import add_badge

from users.serializers import UserSerializer

from . import serializers as authSerializers


class LoginView(views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = authSerializers.LoginSerializer(
            data=self.request.data, context={"request": self.request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)

        # Add 2024 badge if the year is 2024
        if datetime.now().year == 2024:
            add_badge(request.user.profile, "special", 2)
        
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
        serializer = authSerializers.RegisterSerializer(
            data=self.request.data, context={"request": self.request}
        )
        serializer.is_valid(raise_exception=True)


        try:
            user = User.objects.get(username=serializer.validated_data["username"])
        except User.DoesNotExist:
            user = None
        
        if user:
            raise serializers.ValidationError({"message": "User already exists"}, code="authorization")
            
        user = serializer.save()
        
        if user:
            serializer = authSerializers.LoginSerializer(
                data=self.request.data, context={"request": self.request}
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data["user"]
            login(request, user)
            return Response(None, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
