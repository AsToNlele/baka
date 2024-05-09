# Author: Alexandr Celakovsky - xcelak00
from badges.service import add_badge

def handle_newsletter_badge(instance):
    if instance.receive_newsletter:
        add_badge(instance, "special", 1)
