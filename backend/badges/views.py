from badges import models
from badges.serializers import (
    BadgeRaritySerializer,
    BadgeSerializer,
    UserStatsSerializer,
)
from badges.service import badge_list, get_levels, get_user_stats
from django.db.models import Sum
from rest_framework import permissions, viewsets
from rest_framework.generics import views
from rest_framework.views import Response
from users.models import Profile


class UserStatsView(views.APIView):
    def get(self, request):
        profile = request.user.profile

        user_stats = get_user_stats(profile)

        serializer = UserStatsSerializer(user_stats)

        return Response(serializer.data)


class BadgeStatsView(views.APIView):
    def get(self, request):
        # Get user count
        user_count = Profile.objects.count()

        badge_rarity_list = []

        # Query every badge
        for badge in badge_list:
            count = models.Badge.objects.filter(
                badge_type=badge["badge_type"], badge_level=badge["badge_level"]
            ).count()
            rarity = round(count / user_count, 2)
            badge_rarity_list.append(
                {
                    "badge_type": badge["badge_type"],
                    "badge_level": badge["badge_level"],
                    "rarity": rarity,
                }
            )

        serializer = BadgeRaritySerializer(badge_rarity_list, many=True)
        return Response(serializer.data)


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = models.Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAdminUser]
