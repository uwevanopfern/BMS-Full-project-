# Generated by Django 2.2.7 on 2020-01-29 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_payment_tenant'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tenant',
            old_name='membership_time_end',
            new_name='membership_end_time',
        ),
    ]
