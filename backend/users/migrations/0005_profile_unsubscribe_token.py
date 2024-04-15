# Generated by Django 4.2.5 on 2024-04-14 23:53

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_profile_unsubscribe_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='unsubscribe_token',
            field=models.CharField(default=users.models.generate32, max_length=32),
        ),
    ]
