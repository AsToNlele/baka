from re import search
from django.contrib.auth.models import User, Group
from django.db.migrations import serializer
import django_filters
from django_filters import filterset

# from django.http import JsonResponse
from rest_framework import viewsets, generics, filters
from rest_framework import permissions
from rest_framework.decorators import action, api_view
from quickstart.permissions import IsOwnerOrReadOnly
from quickstart.models import Book, Profile
from quickstart.serializers import (
    BookSerializer,
    ProfileSerializer,
    UserSerializer,
    GroupSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.prefetch_related("profile").all().order_by("-date_joined")
    serializer_class = UserSerializer

    @action(detail=False, methods=["GET"], name="Get Me")
    def me(self, request):
        queryset = User.objects.get(id=request.user.id)
        permission_classes = [permissions.IsAuthenticated]
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = ["title", "author"]
    search_fields = ["title", "author"]

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        return queryset

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset()).filter(
            profile=request.user.profile
        )
        serializer = BookSerializer(queryset, many=True)
        return Response(serializer.data)


# class BookList(generics.ListCreateAPIView):
#     model = Book
#     queryset = Book.objects.all()
#     serializer_class = BookSerializer

#     def create(self, request, *args, **kwargs):
#         bill_data = request.data
#         print(bill_data)
#         return bill_data

# def get(self, request, format=None):
#     books = Book.objects.all()
#     serializer = BookSerializer(books, many=True)
#     return Response(serializer.data)

# def post(self, request, format=None):
#     serializer = BookSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(profile=request.user.profile)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class BookDetail(generics.RetrieveUpdateDestroyAPIView):
#     model = Book
#     queryset = Book.objects.all()
#     serializer_class = BookSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

# def get_object(self, pk):
#     try:
#         return Book.objects.get(pk=pk)
#     except Book.DoesNotExist:
#         raise Http404


# class BookDetail(APIView):
#     """
#     Retrieve, update or delete a book instance.
#     """

#     def get_object(self, pk):
#         try:
#             return Book.objects.get(pk=pk)
#         except Book.DoesNotExist:
#             raise Http404

#     def get(self, request, pk, format=None):
#         book = self.get_object(pk)
#         serializer = BookSerializer(book)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         book = self.get_object(pk)
#         serializer = BookSerializer(book, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         book = self.get_object(pk)
#         book.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# class BookList(APIView):
#     def get(self, request, format=None):
#         books = Book.objects.all()
#         serializer = BookSerializer(books, many=True)
#         return Response(serializer.data)

# @api_view(['GET', 'POST'])
# @csrf_exempt
# def book_list(request):
#     """
#     List all code books, or create a new book.
#     """
#     if request.method == 'GET':
#         books = Book.objects.all()
#         serializer = BookSerializer(books, many=True)
#         return JsonResponse(serializer.data, safe=False)

# elif request.method == 'POST':
#     data = JSONParser().parse(request)
#     serializer = bookSerializer(data=data)
#     if serializer.is_valid():
#         serializer.save()
#         return JsonResponse(serializer.data, status=201)
#     return JsonResponse(serializer.errors, status=400)


# class BookViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """

#     # queryset that gets all books from current user
#     queryset = Book.objects.all()

#     serializer_class = BookSerializer
#     permission_classes = [permissions.IsAuthenticated]
# def get_object(self):
#     return Book.objects.filter(profile=self.request.user.profile);

# def list(self, request, *args, **kwargs):
#     return self.retrieve(request, *args, **kwargs)
