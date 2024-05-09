# Author: Alexandr Celakovsky - xcelak00
import os
from hashlib import sha256

from django.contrib.auth.models import Group, User
from dotenv import load_dotenv
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from users.tasks import send_activation_email

from .serializers import (
    EditSelfUserSerializer,
    EditUserSerializer,
    RegisterUserWithEmailSerializer,
    SetUserActivitySerializer,
    UserDetailedSerializer,
    UserSerializer,
)

load_dotenv()

USER_ACTIVATION_TOKEN = os.getenv("USER_ACTIVATION_TOKEN")


class EditSelfUserView(generics.UpdateAPIView):
    serializer_class = EditSelfUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance != request.user:
            return Response({"message": "Cannot edit other users"}, status=400)
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        instance.refresh_from_db()
        responseSerializer = UserDetailedSerializer(instance)
        return Response(responseSerializer.data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.prefetch_related("profile").all().order_by("-date_joined")
    serializer_class = UserDetailedSerializer
    permission_classes = [permissions.IsAdminUser]

    # Edit user
    @action(detail=True, methods=["post"], serializer_class=EditUserSerializer)
    def edit(self, request, pk=None):
        user = self.get_object()
        serializer = EditUserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user.refresh_from_db()
        responseSerializer = UserDetailedSerializer(user)
        return Response(responseSerializer.data)

    @action(detail=True, methods=["post"], serializer_class=SetUserActivitySerializer)
    def set_activity(self, request, pk=None):
        user = self.get_object()
        if user.is_superuser:
            return Response(
                {"message": "Cannot change activity of superuser"}, status=400
            )
        serializer = SetUserActivitySerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user.refresh_from_db()
        responseSerializer = UserDetailedSerializer(user)
        return Response(responseSerializer.data)


class RegisterUserWithEmail(viewsets.generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserWithEmailSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscribe_newsletter = serializer.validated_data["subscribe_newsletter"]
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
        )
        user.is_active = False
        if subscribe_newsletter:
            user.profile.receive_newsletter = True
        user.save()
        send_activation_email.delay(user.username, user.email)

        return Response(UserSerializer(user).data)


class ActivateUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = request.GET.get("email")
        token = request.GET.get("token")


        mixed = USER_ACTIVATION_TOKEN + email
        original = sha256(mixed.encode()).hexdigest()

        if sha256(mixed.encode()).hexdigest() == token:
            try:
                user = User.objects.get(email=email)
                if not user.is_active and user.profile.activated_once:
                    return Response(
                        {"message": "Account already activated"}, status=400
                    )
                user.is_active = True
                user.profile.activated_once = True
                user.save()
            except User.DoesNotExist:
                return Response({"message": "User not found"}, status=400)
            return Response({"message": "Account activated"}, status=200)
        else:
            return Response("Invalid token", status=400, content_type="text/html")
