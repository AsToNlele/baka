# Generated by Django 4.2.5 on 2024-02-17 15:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_remove_flowerbedorders_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]