# Author: Alexandr Celakovsky - xcelak00
from datetime import timedelta
from django.utils.crypto import get_random_string
from rest_framework.fields import timezone
from badges.models import Badge
from django.db.models import Sum

user_levels = [
    {
        "name": "Beginner",
        "xp_required": 0,
        "reward": 0,
        "level": 1
    },
    {
        "name": "Intermediate",
        "xp_required": 20,
        "reward": 10,
        "level": 2,
    },
    {
        "name": "Advanced",
        "xp_required": 50,
        "reward": 20,
        "level": 3,
    },
    {
        "name": "Expert",
        "xp_required": 100,
        "reward": 30,
        "level": 4,
    },
    {
        "name": "Master",
        "xp_required": 200,
        "reward": 40,
        "level": 5,
    },
    {
        "name": "Legend",
        "xp_required": 300,
        "reward": 50,
        "level": 6,
    },
]

flowerbed_badges = [
    {
        "name": "Beginner",
        "description": "One flowerbed",
        "badge_type": "flowerbed",
        "badge_level": 1,
        "xp": 10,
    },
    {
        "name": "Experienced grower",
        "description": "Two flowerbeds",
        "badge_type": "flowerbed",
        "badge_level": 2,
        "xp": 20,
    },
    {
        "name": "Professional",
        "description": "Three flowerbeds",
        "badge_type": "flowerbed",
        "badge_level": 3,
        "xp": 30,
    },
    {
        "name": "Expert",
        "description": "Four flowerbeds",
        "badge_type": "flowerbed",
        "badge_level": 4,
        "xp": 50,
    },
    {
        "name": "Master",
        "description": "Five flowerbeds",
        "badge_type": "flowerbed",
        "badge_level": 5,
        "xp": 100,
    },
]

marketplace_badges = [
    {
        "name": "Small piggybank",
        "description": "100 spent",
        "badge_type": "marketplace",
        "badge_level": 1,
        "xp": 10,
    },
    {
        "name": "Wallet",
        "description": "500 spent",
        "badge_type": "marketplace",
        "badge_level": 2,
        "xp": 20,
    },
    {
        "name": "Purse",
        "description": "1000 spent",
        "badge_type": "marketplace",
        "badge_level": 3,
        "xp": 30,
    },
    {
        "name": "Gold",
        "description": "5000 spent",
        "badge_type": "marketplace",
        "badge_level": 4,
        "xp": 50,
    },
    {
        "name": "Diamond",
        "description": "10000 spent",
        "badge_type": "marketplace",
        "badge_level": 5,
        "xp": 100,
    },
]

emission_badges = [
    {
        "name": "Novice environmentalist",
        "description": "1kg CO2 saved",
        "badge_type": "emission",
        "badge_level": 1,
        "xp": 0,
    },
    {
        "name": "Green environmentalist",
        "description": "5kg CO2 saved",
        "badge_type": "emission",
        "badge_level": 2,
        "xp": 0,
    },
    {
        "name": "Environmentalist",
        "description": "10kg CO2 saved",
        "badge_type": "emission",
        "badge_level": 3,
        "xp": 0,
    },
    {
        "name": "Eco-master",
        "description": "50kg CO2 saved",
        "badge_type": "emission",
        "badge_level": 4,
        "xp": 0,
    },
    {
        "name": "Eco-hero",
        "description": "100kg CO2 saved",
        "badge_type": "emission",
        "badge_level": 5,
        "xp": 0,
    },
]

savings_badges = [
    {
        "name": "Beginner saver",
        "description": "100 saved",
        "badge_type": "savings",
        "badge_level": 1,
        "xp": 0,
    },
    {
        "name": "Economical saver",
        "description": "500 saved",
        "badge_type": "savings",
        "badge_level": 2,
        "xp": 0,
    },
    {
        "name": "Master of savings",
        "description": "1000 saved",
        "badge_type": "savings",
        "badge_level": 3,
        "xp": 0,
    },
    {
        "name": "Grandmaster of savings",
        "description": "2500 saved",
        "badge_type": "savings",
        "badge_level": 4,
        "xp": 0,
    },
    {
        "name": "Champion of savings",
        "description": "5000 saved",
        "badge_type": "savings",
        "badge_level": 5,
        "xp": 0,
    },
]

special_badges = [
    {
        "name": "Newsletter subscriber",
        "description": "Subscribe to the newsletter",
        "badge_type": "special",
        "badge_level": 1,
        "xp": 5,
    },
    {
        "name": "2024 member",
        "description": "Member in 2024",
        "badge_type": "special",
        "badge_level": 2,
        "xp": 5,
    },
]

badges = {
    "flowerbed": flowerbed_badges,
    "marketplace": marketplace_badges,
    "emission": emission_badges,
    "savings": savings_badges,
    "special": special_badges,
}

badge_list = flowerbed_badges + marketplace_badges + emission_badges + savings_badges + special_badges


def get_level(xp):
    current_level = user_levels[0]
    for level in user_levels:
        if xp >= level["xp_required"]:
            current_level = level

    return current_level


def get_levels(xp):
    current_level = user_levels[0]
    current_level_index = 0
    for index, level in enumerate(user_levels):
        if xp >= level["xp_required"]:
            current_level = level
            current_level_index = index

    next_level = None

    if current_level_index + 1 < len(user_levels):
        next_level = user_levels[current_level_index + 1]

    return [current_level, next_level]


def check_if_level_up(current_xp, add_xp):
    current_level = get_level(current_xp)
    new_level = get_level(current_xp + add_xp)

    # Difference means new level
    if new_level["name"] != current_level["name"]:
        return new_level

    return False


def get_user_stats(profile):
    badges = Badge.objects.filter(user=profile)
    xp_sum = badges.aggregate(Sum("xp"))["xp__sum"] or 0
    (current_level, next_level) = get_levels(xp_sum)
    return {
        "badges": badges,
        "xp_sum": xp_sum,
        "current_level": current_level,
        "next_level": next_level,
    }


def add_badge(profile, badge_type, badge_level):
    # Check if badge already exists
    found_badge_type = badges.get(badge_type, None)
    if found_badge_type is None:
        return None

    if badge_level > len(found_badge_type):
        return None

    badge = found_badge_type[badge_level - 1]

    # Check if user already has badge
    user_badges = Badge.objects.filter(user=profile)
    for user_badge in user_badges:
        if (
            user_badge.badge_type == badge_type
            and user_badge.badge_level == badge_level
        ):
            return None

    # Check if adding a badge will level up
    user_stats = get_user_stats(profile)
    result = check_if_level_up(user_stats["xp_sum"], badge["xp"])
    if result is not False:
        # Give reward
        exists = True
        newDiscountCode = get_random_string(length=6).upper()
        
        from orders.models import Discount
        while exists:
            exists = Discount.objects.filter(code=newDiscountCode).exists()
            newDiscountCode = get_random_string(length=6).upper()
        discountObj = Discount.objects.create(
            code=newDiscountCode,
            discount_value=result["reward"],
            valid_from=timezone.now(),
            valid_to=timezone.now() + timedelta(days=30)
        )
        # TODO: Send email with discount code
        from newsletter.tasks import send_single_email

        send_single_email.delay(
            "You have leveled up!",
            f"""
            <h1>Congratulations!</h1>
            <p>You have leveled up to {result["name"]}!</p>
            <p>Your reward is a discount code for {result["reward"]}!</p>
            <p><strong>{newDiscountCode}</strong></p>
            <p>Valid for 30 days.</p>
            """,
            profile.user.email
        )
        
        
        

    # Add badge to user
    newBadge = Badge.objects.create(
        name=badge["name"],
        description=badge["description"],
        badge_type=badge["badge_type"],
        badge_level=badge["badge_level"],
        xp=badge["xp"],
        user=profile,
    )
    
    return newBadge
