from django.conf import settings
from django.urls import include, path
from flowerbed.views import FlowerbedViewSet
from greenhouse.views import GreenhouseViewSet, TimesheetViewSet
from orders.views import OrderViewSet
from rest_framework import routers
from users import views
from django_rest_passwordreset.urls import add_reset_password_urls_to_router
from django.conf.urls.static import static

router = routers.DefaultRouter()
# router.register(r"profiles", views.ProfileViewSet)
# router.register(r"groups", views.GroupViewSet)
router.register(r"greenhouses", GreenhouseViewSet)
router.register(r"flowerbeds", FlowerbedViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"users", views.UserViewSet)
router.register(r"timesheets", TimesheetViewSet)
# router.register(r"marketplace", MarketplaceView)
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
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
