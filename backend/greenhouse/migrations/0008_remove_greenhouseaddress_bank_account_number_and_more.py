# Generated by Django 4.2.5 on 2024-02-21 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('greenhouse', '0007_greenhouseaddress_bank_account_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='greenhouseaddress',
            name='bank_account_number',
        ),
        migrations.AddField(
            model_name='greenhouse',
            name='bank_account_number',
            field=models.CharField(blank=True, null=True),
        ),
    ]
