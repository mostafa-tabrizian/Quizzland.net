# Generated by Django 3.2.4 on 2021-09-16 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0013_alter_blog_thumbnail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_10th',
            field=models.IntegerField(blank=True, default=10, null=True),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_1st',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_2nd',
            field=models.IntegerField(default=2),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_3rd',
            field=models.IntegerField(blank=True, default=3),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_4th',
            field=models.IntegerField(blank=True, default=4, null=True),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_5th',
            field=models.IntegerField(blank=True, default=5, null=True),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_6th',
            field=models.IntegerField(blank=True, default=6, null=True),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_7th',
            field=models.IntegerField(blank=True, default=7, null=True),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_8th',
            field=models.IntegerField(blank=True, default=8, null=True),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='option_point_9th',
            field=models.IntegerField(blank=True, default=9, null=True),
        ),
    ]
