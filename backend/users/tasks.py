import os
from hashlib import sha256

from celery import Celery
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from dotenv import load_dotenv
from newsletter.tasks import send_single_email
from users.models import Profile
from django.conf import settings
CELERY_BROKER_URL = settings.CELERY_BROKER_URL

load_dotenv()


USER_ACTIVATION_TOKEN = os.getenv("USER_ACTIVATION_TOKEN")

DEPLOYED_URL = os.getenv("DEPLOYED_URL")


print("CELERY_BROKER_URL IN TASKS USERS", CELERY_BROKER_URL)
app = Celery("tasks", broker=CELERY_BROKER_URL)



@app.task
def send_activation_email(username, email):
    mixed = USER_ACTIVATION_TOKEN  + email
    token = sha256(mixed.encode()).hexdigest()

    title = "Activate your account"
    html = f"""
    <h1>Activate your account</h1>
    <p>Hello {username},</p>
    <p>Please click the link below to activate your account:</p>
    <a href='{DEPLOYED_URL}/activate-account-confirm?email={email}&token={token}' style='color: green;'>Activate account</a>
    """

    send_single_email.delay(title, html, email)
