from django.contrib.auth.models import User, Group
from rest_framework import serializers

from quickstart.models import Book, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = User
        fields = ["url", "username", "email", "groups", "profile"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

        from rest_framework import serializers


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"
