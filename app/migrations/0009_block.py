# Generated by Django 2.2.7 on 2020-01-21 01:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20200121_0333'),
    ]

    operations = [
        migrations.CreateModel(
            name='Block',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Main Block', max_length=100)),
                ('number', models.IntegerField(default=1)),
                ('floor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Floor')),
            ],
        ),
    ]
