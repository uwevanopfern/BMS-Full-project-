# Generated by Django 2.2.7 on 2020-11-23 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0029_auto_20201123_1921'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tenant',
            name='contract',
            field=models.FileField(blank=True, null=True, upload_to='contracts/<django.db.models.fields.TextField>'),
        ),
    ]
