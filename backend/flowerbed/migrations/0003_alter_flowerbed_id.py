# Generated by Django 4.2.5 on 2024-01-05 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowerbed', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flowerbed',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
