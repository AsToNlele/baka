# Generated by Django 4.2.5 on 2024-04-20 18:43

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import greenhouse.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Greenhouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, null=True)),
                ('description', models.TextField(blank=True, db_comment='Description', null=True)),
                ('rules', models.CharField(blank=True, null=True)),
                ('published', models.BooleanField(default=True)),
                ('bank_account_number', models.CharField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, height_field='image_height', null=True, upload_to=greenhouse.models.greenhouse_upload_to, width_field='image_width')),
                ('image_width', models.PositiveIntegerField(default=0)),
                ('image_height', models.PositiveIntegerField(default=0)),
                ('caretaker', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='caretaker', to='users.profile')),
            ],
            options={
                'db_table': 'greenhouses',
            },
        ),
        migrations.CreateModel(
            name='GreenhouseAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(blank=True, default='CZ', null=True)),
                ('state', models.CharField(blank=True, null=True)),
                ('city', models.CharField(blank=True, default='Brno', null=True)),
                ('city_part', models.CharField(blank=True, null=True)),
                ('street', models.CharField(blank=True, null=True)),
                ('zipcode', models.CharField(blank=True, null=True)),
                ('latitude', models.CharField(blank=True, null=True)),
                ('longitude', models.CharField(blank=True, null=True)),
            ],
            options={
                'db_table': 'greenhouse_address',
            },
        ),
        migrations.CreateModel(
            name='GreenhouseBusinessHour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.IntegerField()),
                ('greenhouse', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='greenhouse.greenhouse')),
            ],
            options={
                'db_table': 'greenhouse_business_hours',
            },
        ),
        migrations.CreateModel(
            name='Timesheet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('pay', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('status', models.CharField(blank=True, default='submitted', null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='author', to='users.profile')),
                ('greenhouse', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.greenhouse')),
            ],
            options={
                'db_table': 'timesheets',
            },
        ),
        migrations.CreateModel(
            name='TimesheetUpdate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('pay', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('status', models.CharField(blank=True, default='submitted', null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='update_author', to='users.profile')),
                ('timesheet', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.timesheet')),
            ],
            options={
                'db_table': 'timesheet_updates',
            },
        ),
        migrations.CreateModel(
            name='TimesheetWorkingHour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateTimeField(blank=True, null=True)),
                ('end', models.DateTimeField(blank=True, null=True)),
                ('timesheet', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.timesheet')),
                ('timesheet_update', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.timesheetupdate')),
            ],
            options={
                'db_table': 'timesheet_working_hours',
            },
        ),
        migrations.CreateModel(
            name='TimesheetItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('timesheet', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.timesheet')),
                ('timesheet_update', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.timesheetupdate')),
            ],
            options={
                'db_table': 'timesheet_items',
            },
        ),
        migrations.CreateModel(
            name='GreenhouseImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.CharField(blank=True, null=True)),
                ('greenhouse', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.greenhouse')),
            ],
            options={
                'db_table': 'greenhouse_images',
            },
        ),
        migrations.CreateModel(
            name='GreenhouseBusinessHourPeriod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('open', models.TimeField()),
                ('close', models.TimeField()),
                ('business_hour', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='greenhouse.greenhousebusinesshour')),
            ],
            options={
                'db_table': 'greenhouse_business_hour_periods',
            },
        ),
        migrations.AddField(
            model_name='greenhouse',
            name='greenhouse_address',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='greenhouse.greenhouseaddress'),
        ),
        migrations.AddField(
            model_name='greenhouse',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='owner', to='users.profile'),
        ),
    ]
