# Generated by Django 2.2.7 on 2020-01-17 09:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_building_acronym'),
    ]

    operations = [
        migrations.CreateModel(
            name='Manager',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('email', models.CharField(blank=True, max_length=100, unique=True)),
                ('phone', models.CharField(blank=True, max_length=100)),
                ('password', models.CharField(blank=True, max_length=100)),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Building')),
            ],
        ),
    ]
