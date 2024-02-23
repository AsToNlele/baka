# Generated by Django 4.2.5 on 2024-02-23 14:54

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('greenhouse', '0008_remove_greenhouseaddress_bank_account_number_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Product', max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('image', models.CharField(blank=True, null=True)),
                ('shared', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='SharedProduct',
            fields=[
                ('product_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='marketplace.product')),
            ],
            options={
                'db_table': 'shared_products',
                'db_table_comment': 'Shared products',
            },
            bases=('marketplace.product',),
        ),
        migrations.CreateModel(
            name='MarketplaceProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.IntegerField()),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('greenhouse', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.greenhouse')),
                ('product', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='marketplace.product')),
            ],
            options={
                'db_table': 'marketplace_products',
                'db_table_comment': 'Marketplace products',
            },
        ),
        migrations.CreateModel(
            name='CustomProduct',
            fields=[
                ('product_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='marketplace.product')),
                ('greenhouse', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.greenhouse')),
            ],
            bases=('marketplace.product',),
        ),
    ]