# Generated by Django 3.2.4 on 2021-09-15 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0011_auto_20210915_1023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='thumbnail',
            field=models.ImageField(default='', upload_to='QuizzesThumbnail'),
        ),
    ]
