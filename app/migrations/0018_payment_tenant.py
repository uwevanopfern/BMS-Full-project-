# Generated by Django 2.2.7 on 2020-01-29 16:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_auto_20200128_1809'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tenant_names', models.TextField()),
                ('tenant_tin', models.CharField(max_length=100, unique=True)),
                ('tenant_main_email', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('tenant_main_phone', models.CharField(blank=True, max_length=200, null=True)),
                ('payment_date', models.CharField(blank=True, max_length=200, null=True)),
                ('payment_method', models.CharField(blank=True, max_length=200, null=True)),
                ('membership_type', models.CharField(blank=True, default='Not a member', max_length=200, null=True)),
                ('membership_time_end', models.CharField(blank=True, max_length=200, null=True)),
                ('rental_amount', models.IntegerField(default=0)),
                ('business_desc', models.TextField()),
                ('room', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.Room')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invoice_no', models.CharField(max_length=200)),
                ('ebm_receipt_create_on', models.DateField()),
                ('sub_total', models.IntegerField(default=0)),
                ('vat', models.IntegerField(default=0)),
                ('total', models.IntegerField(default=0)),
                ('tenant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.Tenant')),
            ],
        ),
    ]
