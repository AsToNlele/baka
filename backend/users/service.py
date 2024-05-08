from badges.service import add_badge

def handle_newsletter_badge(instance):
    if instance.receive_newsletter:
        print("Adding Newsletter badge")
        add_badge(instance, "special", 1)
