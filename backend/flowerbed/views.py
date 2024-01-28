from rest_framework import viewsets
from flowerbed.models import Flowerbed
from flowerbed.serializers import FlowerbedSerializer


class FlowerbedViewSet(viewsets.ModelViewSet):
    queryset = Flowerbed.objects.all()
    serializer_class = FlowerbedSerializer
