# Generated by Django 2.2.7 on 2020-11-23 17:45

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0032_tenant_contract'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='billing',
            name='id',
        ),
        migrations.AddField(
            model_name='billing',
            name='ebm_invoice',
            field=models.CharField(default=1, max_length=200),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='billing',
            name='invoice_no',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='tenant',
            name='contract',
            field=models.FileField(upload_to='contracts'),
        ),
    ]
