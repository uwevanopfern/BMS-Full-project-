# Generated by Django 2.2.7 on 2020-01-17 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('email', models.CharField(blank=True, max_length=100, unique=True)),
                ('contact', models.CharField(blank=True, max_length=100)),
                ('address', models.CharField(max_length=255)),
                ('website', models.CharField(blank=True, max_length=100)),
                ('avatar', models.ImageField(upload_to='avatars')),
            ],
        ),
    ]