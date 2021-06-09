# Generated by Django 3.2.4 on 2021-06-09 04:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_auto_20210608_2224'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuizzesPointy',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('category', models.CharField(default=None, max_length=100)),
                ('innerCategory', models.CharField(default=None, max_length=100)),
                ('title', models.CharField(default=None, max_length=100)),
                ('title_english', models.CharField(default=None, max_length=100)),
                ('monthly_views', models.IntegerField(default=0)),
                ('views', models.IntegerField(default=0)),
                ('background', models.CharField(max_length=100)),
                ('result_upTo_1', models.IntegerField(default=None)),
                ('result_title_1', models.CharField(max_length=200)),
                ('result_text_1', models.TextField(default=None)),
                ('result_img_1', models.CharField(max_length=100)),
                ('result_upTo_2', models.IntegerField(default=None)),
                ('result_title_2', models.CharField(max_length=200)),
                ('result_text_2', models.TextField(default=None)),
                ('result_img_2', models.CharField(max_length=100)),
                ('result_upTo_3', models.IntegerField(default=None)),
                ('result_title_3', models.CharField(max_length=200)),
                ('result_text_3', models.TextField(default=None)),
                ('result_img_3', models.CharField(max_length=100)),
                ('result_upTo_4', models.IntegerField(default=None)),
                ('result_title_4', models.CharField(max_length=200)),
                ('result_text_4', models.TextField(default=None)),
                ('result_img_4', models.CharField(max_length=100)),
                ('result_upTo_5', models.IntegerField(default=None)),
                ('result_title_5', models.CharField(max_length=200)),
                ('result_text_5', models.TextField(default=None)),
                ('result_img_5', models.CharField(max_length=100)),
                ('result_upTo_6', models.IntegerField(default=None)),
                ('result_title_6', models.CharField(max_length=200)),
                ('result_text_6', models.TextField(default=None)),
                ('result_img_6', models.CharField(max_length=100)),
                ('result_upTo_7', models.IntegerField(default=None)),
                ('result_title_7', models.CharField(max_length=200)),
                ('result_text_7', models.TextField(default=None)),
                ('result_img_7', models.CharField(max_length=100)),
                ('result_upTo_8', models.IntegerField(default=None)),
                ('result_title_8', models.CharField(max_length=200)),
                ('result_text_8', models.TextField(default=None)),
                ('result_img_8', models.CharField(max_length=100)),
                ('result_upTo_9', models.IntegerField(default=None)),
                ('result_title_9', models.CharField(max_length=200)),
                ('result_text_9', models.TextField(default=None)),
                ('result_img_9', models.CharField(max_length=100)),
                ('result_upTo_10', models.IntegerField(default=None)),
                ('result_title_10', models.CharField(max_length=200)),
                ('result_text_10', models.TextField(default=None)),
                ('result_img_10', models.CharField(max_length=100)),
                ('publish', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
    ]
