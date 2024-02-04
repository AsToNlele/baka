# Generated by Django 4.2.5 on 2024-02-02 14:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('flowerbed', '0007_lease_user_alter_lease_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='flowerbed',
            name='dimension_height',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='flowerbed',
            name='dimension_width',
            field=models.FloatField(default=0),
        ),
        migrations.CreateModel(
            name='FlowerbedTools',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tool', models.CharField(blank=True, null=True)),
                ('flowerbed', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='flowerbed.flowerbed')),
            ],
            options={
                'db_table': 'flowerbed_tools',
            },
        ),
        migrations.CreateModel(
            name='FlowerbedIdealPlants',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plant', models.CharField(blank=True, null=True)),
                ('flowerbed', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='flowerbed.flowerbed')),
            ],
            options={
                'db_table': 'flowerbed_ideal_plants',
            },
        ),
    ]
