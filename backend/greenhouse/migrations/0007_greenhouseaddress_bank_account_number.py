# Generated by Django 4.2.5 on 2024-02-21 07:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('greenhouse', '0006_alter_greenhousebusinesshour_greenhouse_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='greenhouseaddress',
            name='bank_account_number',
            field=models.CharField(blank=True, null=True),
        ),
    ]
