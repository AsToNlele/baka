# Author: Alexandr Celakovsky - xcelak00
from django.conf import settings
from django.urls import include, path
from badges.views import BadgeStatsView, BadgeViewSet, UserStatsView
from flowerbed.views import FlowerbedViewSet
from greenhouse.views import GreenhouseUploadImageView, GreenhouseViewSet, TimesheetViewSet
from orders.views import DiscountCodeAvailabilityView, OrderViewSet
from rest_framework import routers
from socialposts.views import SocialPostViewSet
from users import views
from django_rest_passwordreset.urls import add_reset_password_urls_to_router
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r"greenhouses", GreenhouseViewSet)
router.register(r"flowerbeds", FlowerbedViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"users", views.UserViewSet)
router.register(r"timesheets", TimesheetViewSet)
router.register(r"socialposts", SocialPostViewSet)
router.register(r"badges", BadgeViewSet)
add_reset_password_urls_to_router(router, base_path='password-reset')

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("auth.urls"), name="auth"),
    path(
        "password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("marketplace/", include("marketplace.urls"), name="marketplace"),
    path("newsletter/", include("newsletter.urls"), name="newsletter"),
    path("register/", views.RegisterUserWithEmail.as_view(), name="register"),
    path("activate/", views.ActivateUserView.as_view(), name="activate"),
    path("edit-self/", views.EditSelfUserView.as_view(), name="edit-self"),
    path("greenhouse-upload/", GreenhouseUploadImageView.as_view(), name="greenhouse-upload"),
    path("user-stats/", UserStatsView.as_view(), name="user-stats"),
    path("badge-rarity/", BadgeStatsView.as_view(), name="badge-rarity"),
    path("discount-code-availability/", DiscountCodeAvailabilityView.as_view(), name="discount-code-availability"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
