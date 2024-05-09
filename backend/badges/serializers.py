# Author: Alexandr Celakovsky - xcelak00
from rest_framework import serializers

from badges.models import Badge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class BadgeRaritySerializer(serializers.Serializer):
    badge_type = serializers.CharField()
    badge_level = serializers.IntegerField()
    rarity = serializers.FloatField()

class LevelSerializer(serializers.Serializer):
    name = serializers.CharField()
    xp_required = serializers.IntegerField()
    reward = serializers.IntegerField()
    level = serializers.IntegerField()
    
class UserStatsSerializer(serializers.Serializer):
    badges = BadgeSerializer(many=True)
    xp_sum = serializers.IntegerField(required=False)
    current_level = LevelSerializer()
    next_level = LevelSerializer()
