from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse



@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "books": reverse("book-list", request=request, format=format),
            "users": reverse("user-list", request=request, format=format),
            "profiles": reverse("profile-list", request=request, format=format),
            "groups": reverse("group-list", request=request, format=format),
        }
    )
