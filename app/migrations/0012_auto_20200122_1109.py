# Generated by Django 2.2.7 on 2020-01-22 09:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_auto_20200121_1838'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='manager',
            name='building',
        ),
        migrations.AddField(
            model_name='user',
            name='building',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.Building'),
        ),
        migrations.AddField(
            model_name='user',
            name='is_employee',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_manager',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.DeleteModel(
            name='Employee',
        ),
        migrations.DeleteModel(
            name='Manager',
        ),
    ]
