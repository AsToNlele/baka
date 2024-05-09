# Author: Alexandr Celakovsky - xcelak00
from greenhouse.models import Greenhouse
from rest_framework import permissions


class IsOwnerOrCaretaker(permissions.BasePermission):
    def has_object_permission(self, request, view, object):
        if (
            object.owner == request.user.profile
            or object.caretaker == request.user.profile
            or request.user.is_superuser
            or request.user.is_staff
        ):
            return True
        return False


class IsOwnerOrAuthorTimesheet(permissions.BasePermission):
    def has_object_permission(self, request, view, object):
        if (
            object.greenhouse.owner == request.user.profile
            or object.author == request.user.profile
        ):
            return True
        return False


class IsCaretakerTimesheet(permissions.BasePermission):
    def has_object_permission(self, request, view, object):
        if object.greenhouse.caretaker == request.user.profile:
            return True
        return False
