from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django_seed import Seed
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = "Seeds the database with some initial data."

    # def add_arguments(self, parser):
    #     parser.add_argument("poll_ids", nargs="+", type=int)

    def handle(self, *args, **options):
        seeder = Seed.seeder(locale="cs_CZ")
        if User.objects.filter(username="root").exists():
            self.stdout.write(self.style.SUCCESS('Root user already exists'))
        else:
            User.objects.create_superuser(email="root@root.com", username="root", password="root")
            self.stdout.write(self.style.SUCCESS('Root user created'))
            
        self.stdout.write(self.style.SUCCESS('Adding users'))
        for _ in range(2):
            username = seeder.faker.user_name()
            default_password = "user"
            seeder.add_entity(User, 1, {
                "username": username,
                "password": make_password(default_password),
                "is_superuser": False,
            })
            self.stdout.write(self.style.NOTICE(f'User {username} added with password {default_password}'))

        seeder.execute()
        self.stdout.write(self.style.SUCCESS('Successfully seeded the database'))
        
