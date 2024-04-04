from greenhouse.models import Greenhouse, GreenhouseAddress, WorkStatement
from greenhouse.permissions.isOwnerOrCaretaker import IsOwnerOrCaretaker
from greenhouse.serializers import (
    EditGreenhouseSerializer,
    EmptySerializer,
    GreenhouseAddressSerializer,
    GreenhouseSerializer,
    SetCaretakerSerializer,
    SetOwnerSerializer,
    WorkStatementSerializer,
)
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import Response


class GreenhouseAddressViewSet(viewsets.ModelViewSet):
    queryset = GreenhouseAddress.objects.all()
    serializer_class = GreenhouseAddressSerializer


class GreenhouseViewSet(viewsets.ModelViewSet):
    queryset = Greenhouse.objects.all()
    serializer_class = GreenhouseSerializer

    # Edit few fields of the greenhouse

    @action(
        methods=["put"],
        detail=True,
        serializer_class=EditGreenhouseSerializer,
        name="Edit greenhouse",
        permission_classes=[IsOwnerOrCaretaker],
    )
    def edit_greenhouse(self, request, pk=None):
        # Call the permission class
        # self.check_object_permissions(request, self.get_object())

        instance = get_object_or_404(Greenhouse.objects.all(), pk=pk)
        serializer = self.get_serializer(instance, data=request.data, required=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)

        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Set caretaker",
        serializer_class=SetCaretakerSerializer,
    )
    def set_caretaker(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin or caretaker
        if not request.user.is_superuser and greenhouse.owner != request.user.profile:
            return Response(
                {"message": "You are not allowed to set a caretaker"}, status=403
            )

        serializer = SetCaretakerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        caretaker_id = serializer.data.get("caretaker")
        greenhouse.caretaker_id = caretaker_id
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Unset caretaker",
        serializer_class=EmptySerializer,
    )
    def unset_caretaker(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin or caretaker
        if (
            not request.user.is_superuser
            and greenhouse.owner != request.user.profile
            and greenhouse.caretaker != request.user.profile
        ):
            return Response(
                {"message": "You are not allowed to unset a caretaker"}, status=403
            )

        greenhouse.caretaker = None
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Set owner",
        serializer_class=SetOwnerSerializer,
    )
    def set_owner(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin
        if not request.user.is_superuser:
            return Response(
                {"message": "You are not allowed to set an owner"}, status=403
            )

        serializer = SetOwnerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        owner_id = serializer.data.get("owner")
        greenhouse.owner_id = owner_id
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    @action(
        detail=True,
        methods=["put"],
        name="Unset owner",
        serializer_class=EmptySerializer,
    )
    def unset_owner(self, request, pk=None):
        greenhouse = self.get_object()
        # If not admin or caretaker
        if not request.user.is_superuser and greenhouse.owner != request.user.profile:
            return Response(
                {"message": "You are not allowed to unset an owner"}, status=403
            )

        greenhouse.owner = None
        greenhouse.save()

        serializer = GreenhouseSerializer(greenhouse)
        return Response(serializer.data, status=200)

    # # Get WorkStatements for the greenhouse
    # @action(
    #     detail=True,
    #     methods=["get"],
    #     name="Get WorkStatements",
    #     serializer_class=WorkStatementSerializer(many=True),
    # )
    # def get_work_statements(self, request, pk=None):
    #     greenhouse = self.get_object()
    #     # If admin, caretaker or owner
    #     if not request.user.is_superuser:
    #         self.check_object_permissions(request, greenhouse)
    #
    #     workstatements = WorkStatement.objects.filter(greenhouse=greenhouse)
    #     print(workstatements)
    #     serializer = WorkStatementSerializer(workstatements, many=True)
    #     return Response(serializer.data, status=200)
