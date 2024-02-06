from greenhouse.models import Greenhouse, GreenhouseAddress
from greenhouse.permissions.isOwnerOrCaretaker import IsOwnerOrCaretaker
from greenhouse.serializers import (EditGreenhouseSerializer,
                                    GreenhouseAddressSerializer,
                                    GreenhouseSerializer)
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
    
    @action(methods = ["put"], detail=True, serializer_class=EditGreenhouseSerializer, name="Edit greenhouse", permission_classes=[IsOwnerOrCaretaker])
    def edit_greenhouse(self, request, pk=None):
        # Call the permission class
        # self.check_object_permissions(request, self.get_object())
        
        instance = get_object_or_404(Greenhouse.objects.all(), pk=pk)
        serializer = self.get_serializer(instance, data=request.data, required=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)
        
        return Response(serializer.data, status=200)

    # Possible to add a caretaker to the greenhouse
    # @action(detail=True, methods=["put"], name="Change caretaker")
    # def change_caretaker(self, request, pk=None):
    #     serializer = GreenhouseCareTakerSerializer(data=request.data)
    #     if not serializer.is_valid():
    #         return Response(serializer.errors, status=400)
    #     greenhouse = self.get_object()
    #     caretaker_id = serializer.data.get("caretaker")
    #     greenhouse.caretaker_id = caretaker_id
    #     greenhouse.save()
    #
    #     return Response(serializer.data, status=200)
