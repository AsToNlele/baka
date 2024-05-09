# Author: Alexandr Celakovsky - xcelak00
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import serializers


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(label="Username", write_only=True)
    password = serializers.CharField(
        label="Password",
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if username and password:
            user = authenticate(
                request=self.context.get("request"),
                username=username,
                password=password,
            )
            if not user:
                raise serializers.ValidationError("Wrong username or password", code="authorization")
        else:
            raise serializers.ValidationError( 'Username and password are required', code="authorization")
        attrs["user"] = user
        return attrs

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(label="Username", write_only=True)
    password = serializers.CharField(
        label="Password",
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        return user
