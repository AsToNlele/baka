from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"gallery", views.NewsletterImageViewset)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "send-newsletter/", views.SendNewsletterView.as_view(), name="send-newsletter"
    ),
    path("unsubscribe/", views.UnsubscribeView.as_view(), name="unsubscribe"),
    path(
        "subscriber-count/",
        views.SubscriberCountView.as_view(),
        name="subscriber-count",
    ),
]
