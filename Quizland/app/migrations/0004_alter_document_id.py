# Generated by Django 3.2.4 on 2021-06-08 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20210608_1901'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='id',
            field=models.CharField(default=models.CharField(default=None, max_length=200), max_length=200, primary_key=True, serialize=False),
        ),
    ]
