# Generated by Django 4.2.5 on 2024-02-14 07:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowerbed', '0013_alter_flowerbed_priceperday'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flowerbed',
            name='dimension_height',
            field=models.FloatField(default=1.0),
        ),
        migrations.AlterField(
            model_name='flowerbed',
            name='dimension_width',
            field=models.FloatField(default=1.0),
        ),
    ]
