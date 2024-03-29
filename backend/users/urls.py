from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

# urlpatterns = [
#     path("", views.BookList.as_view(), name="book-list"),
#     path("<int:pk>", views.BookDetail.as_view(), name="book-detail"),
# ]

# urlpatterns = format_suffix_patterns(urlpatterns)
