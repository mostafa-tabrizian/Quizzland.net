# Generated by Django 3.2.9 on 2021-11-08 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0016_auto_20211106_1947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='password',
            field=models.CharField(default=None, max_length=200),
        ),
    ]