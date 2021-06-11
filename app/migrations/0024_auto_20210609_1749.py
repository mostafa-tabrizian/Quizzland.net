# Generated by Django 3.2.4 on 2021-06-09 13:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0023_auto_20210609_1737'),
    ]

    operations = [
        migrations.CreateModel(
            name='Quiz_Pointy_Questions',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('category', models.CharField(default=None, max_length=100)),
                ('innerCategory', models.CharField(default=None, max_length=100)),
                ('question', models.CharField(default=None, max_length=200)),
                ('option_Value_1', models.CharField(max_length=100)),
                ('option_Point_1', models.IntegerField(default=1)),
                ('option_Value_2', models.CharField(max_length=100)),
                ('option_Point_2', models.IntegerField(default=1)),
                ('option_Value_3', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_3', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_4', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_4', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_5', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_5', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_6', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_6', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_7', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_7', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_8', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_8', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_9', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_9', models.IntegerField(blank=True, default=1, null=True)),
                ('option_Value_10', models.CharField(blank=True, max_length=100, null=True)),
                ('option_Point_10', models.IntegerField(blank=True, default=1, null=True)),
                ('publish', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
        migrations.RenameModel(
            old_name='QuizQuestions',
            new_name='Quiz_Questions',
        ),
    ]