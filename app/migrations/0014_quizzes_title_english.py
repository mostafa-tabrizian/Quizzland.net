# Generated by Django 3.2.4 on 2021-06-08 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_alter_quizzes_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizzes',
            name='title_english',
            field=models.CharField(default=None, max_length=100),
        ),
    ]