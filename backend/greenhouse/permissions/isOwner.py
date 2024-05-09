# Author: Alexandr Celakovsky - xcelak00
from rest_framework import permissions

from greenhouse.models import Greenhouse

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, object):
        if object.owner == request.user.profile or request.user.is_superuser or request.user.is_staff:
            return True
        return False 
