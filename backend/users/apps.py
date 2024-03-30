from django.apps import AppConfig
from django_rest_passwordreset.signals import reset_password_token_created


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        from users import signals

        reset_password_token_created.connect(signals.password_reset_token_created)
