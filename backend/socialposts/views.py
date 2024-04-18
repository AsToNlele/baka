from django.shortcuts import render
from kombu.utils.functional import random
from rest_framework import permissions, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.mixins import Response
from socialposts.models import SocialPost
from socialposts.serializer import (
    CreateSocialPostSerializer,
    EditSocialPostSerializer,
    SocialPostAppSerializer,
    SocialPostSerializer,
)


class SocialPostViewSet(viewsets.ModelViewSet):
    queryset = SocialPost.objects.all()
    serializer_class = SocialPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateSocialPostSerializer
        return super(SocialPostViewSet, self).get_serializer_class()

    def get_permissions(self):
        if self.action == "create" or self.action == "destroy" or self.action == "retrieve":
            return [permissions.IsAuthenticated()]
        elif self.action == "update":
            return [permissions.IsAdminUser()]

        return super(SocialPostViewSet, self).get_permissions()

    def create(self, request, *args, **kwargs):
        data = request.data
        data["author"] = request.user.profile.id
        serializer = CreateSocialPostSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        instance.author = request.user.profile
        instance.save()
        
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user.profile and not request.user.is_superuser:
            return Response({"message": "Not your post"}, status=403)
        return super().destroy(request, *args, **kwargs)

    # Show random 5 approved posts
    def list(self, request, *args, **kwargs):
        queryset = SocialPost.objects.filter(approved=True).order_by('?')
        ids = queryset.values_list('pk', flat=True)
        if(ids.count() > 5):
            random_ids = random.sample(list(ids), 5)
            queryset = queryset.filter(pk__in=random_ids)
        serializer = SocialPostSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        permission_classes = ([permissions.IsAuthenticated])
        if instance.author != request.user.profile and not request.user.is_superuser:
            return Response({"message": "Not your post"}, status=403)
        serializer = SocialPostAppSerializer(instance)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["put"],
        serializer_class=EditSocialPostSerializer,
        permission_classes=[permissions.IsAdminUser],
    )
    def edit(self, request, pk=None):
        post = self.get_object()
        serializer = EditSocialPostSerializer(post, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        post.refresh_from_db()
        responseSerializer = SocialPostSerializer(post)
        return Response(responseSerializer.data)

    # Disable update
    def update(self, request, *args, **kwargs):
        return Response({"message": "Method not allowed"}, status=405)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
        serializer_class=SocialPostAppSerializer,
    )
    def my_posts(self, request):
        queryset = SocialPost.objects.filter(author=request.user.profile)
        serializer = SocialPostAppSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAdminUser],
        serializer_class=SocialPostAppSerializer,
    )
    def all_posts(self, request):
        queryset = SocialPost.objects.all()
        serializer = SocialPostAppSerializer(queryset, many=True)
        return Response(serializer.data)
