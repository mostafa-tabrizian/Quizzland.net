# Generated by Django 3.2.9 on 2021-11-09 16:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0019_alter_profile_newsletter'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='newsletter',
        ),
    ]