# Generated by Django 3.2.4 on 2021-06-08 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20210608_1932'),
    ]

    operations = [
        migrations.AlterField(
            model_name='categories',
            name='title',
            field=models.SlugField(allow_unicode=True, default=None, max_length=200),
        ),
    ]
