from rest_framework import permissions

from greenhouse.models import Greenhouse

class IsOwnerOrCaretaker(permissions.BasePermission):

    def has_object_permission(self, request, view, object):
        print(object.owner, request.user.profile, object.caretaker, request.user.profile)
        if object.owner == request.user.profile or object.caretaker == request.user.profile:
            return False
        return False 
