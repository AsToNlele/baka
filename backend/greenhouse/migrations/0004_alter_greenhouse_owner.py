# Generated by Django 4.2.5 on 2024-04-04 17:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('greenhouse', '0003_remove_workstatementitem_author_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='greenhouse',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='owner', to='users.profile'),
        ),
    ]