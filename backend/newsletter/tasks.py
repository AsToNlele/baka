# Author: Alexandr Celakovsky - xcelak00
import os
from hashlib import sha256

from celery import Celery
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from dotenv import load_dotenv
from users.models import Profile
from django.conf import settings
CELERY_BROKER_URL = settings.CELERY_BROKER_URL

load_dotenv()

EMAIL_UNSUBSCRIBE_TOKEN = os.getenv("EMAIL_UNSUBSCRIBE_TOKEN")
DEPLOYED_URL = os.getenv("DEPLOYED_URL")


# PROD = os.environ.get("PROD", False)
app = Celery("tasks", broker=CELERY_BROKER_URL)


@app.task
def send_newsletter(title, html):
    subscribers = Profile.objects.filter(receive_newsletter=True)
    for subscriber in subscribers:
        userEmail = subscriber.user.email
        if userEmail:
            finalHtml = html + addUnsubscribeLink(userEmail)
            send_single_email.delay(title, finalHtml, userEmail)


@app.task
def send_single_email(title, html, email):
    msg = EmailMultiAlternatives(
        # title:
        title,
        # message:
        "",
        # from:
        settings.EMAIL_HOST_USER,
        # to:
        [email],
    )
    msg.attach_alternative(html, "text/html")
    msg.send()


def addUnsubscribeLink(email):
    # Combine email and token
    mixed = EMAIL_UNSUBSCRIBE_TOKEN + email
    token = sha256(mixed.encode()).hexdigest()
    return f"<a href='{DEPLOYED_URL}/api/unsubscribe?email={email}&token={token}' style='color: red;'>Unsubscribe from newsletter</a>"
