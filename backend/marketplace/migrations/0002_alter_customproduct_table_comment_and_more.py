# Generated by Django 4.2.5 on 2024-02-23 15:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketplace', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTableComment(
            name='customproduct',
            table_comment='Custom products',
        ),
        migrations.AlterModelTableComment(
            name='product',
            table_comment='Products',
        ),
        migrations.AlterModelTable(
            name='customproduct',
            table='custom_products',
        ),
        migrations.AlterModelTable(
            name='product',
            table='products',
        ),
    ]
