import os
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
from dotenv import load_dotenv
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from hashlib import sha256
from newsletter.models import NewsletterImage, NewsletterPost
from newsletter.serializer import NewsletterImageSerializer, NewsletterPostSerializer

from newsletter.tasks import send_newsletter
from users.models import Profile

load_dotenv()

EMAIL_UNSUBSCRIBE_TOKEN = os.getenv("EMAIL_UNSUBSCRIBE_TOKEN")

class SendNewsletterView(APIView):
    def post(self, request):
        # Admin only
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"message": "Unauthorized"}, status=403)

        
        # Get the email from the request
        title = request.data.get('title')
        html = request.data.get('html')
        json = request.data.get('json')

        # Call celery task
        # send_newsletter.delay(html)
        send_newsletter.apply_async((title,html,), delay=10)

        if json:
            post = NewsletterPost.objects.create(title=title, content=json)
            print(post)
        return Response({"message": "Email sent successfully"}, status=200)

class UnsubscribeView(APIView):
    def get(self, request):
        email = request.GET.get('email')
        token = request.GET.get('token')

        mixed = EMAIL_UNSUBSCRIBE_TOKEN + email

        if sha256(mixed.encode()).hexdigest() == token:
            # Find user by email
            try:
                user = User.objects.get(email=email)
                user.profile.receive_newsletter = False
                user.profile.save()
            except User.DoesNotExist:
                return Response({"message": "User not found"}, status=404)
            # return Response({"message": "Unsubscribed successfully"}, status=200)
            return Response("Unsubscribed successfully", status=200, content_type="text/html")
        else:
            return Response("Invalid token", status=400, content_type="text/html")


class SubscriberCountView(APIView):
    def get(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"message": "Unauthorized"}, status=403)
        subscribers = Profile.objects.filter(receive_newsletter=True).count()
        return Response({"subscribers": subscribers}, status=200)

class NewsletterImageViewset(viewsets.ModelViewSet):
    queryset = NewsletterImage.objects.order_by('-created_at')
    serializer_class = NewsletterImageSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()

class NewsletterPostListView(viewsets.generics.ListAPIView):
    queryset = NewsletterPost.objects.all()
    serializer_class = NewsletterPostSerializer
    permission_classes = [IsAdminUser]

