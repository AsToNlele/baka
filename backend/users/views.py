from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import EditUserSerializer, GroupSerializer, SetUserActivitySerializer, UserDetailedSerializer, UserSerializer


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
            return Response({"message": "Cannot change activity of superuser"}, status=400)
        serializer = SetUserActivitySerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user.refresh_from_db()
        responseSerializer = UserDetailedSerializer(user)
        return Response(responseSerializer.data)
