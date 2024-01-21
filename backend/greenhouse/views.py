from rest_framework import viewsets

from greenhouse.models import Greenhouse, GreenhouseAddress
from greenhouse.serializers import GreenhouseAddressSerializer, GreenhouseSerializer

class GreenhouseAddressViewSet(viewsets.ModelViewSet):
    queryset = GreenhouseAddress.objects.all()
    serializer_class = GreenhouseAddressSerializer

class GreenhouseViewSet(viewsets.ModelViewSet):
    queryset = Greenhouse.objects.all()
    serializer_class = GreenhouseSerializer
