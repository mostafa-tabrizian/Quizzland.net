# Generated by Django 3.2.4 on 2021-06-13 06:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_auto_20210613_1057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='innercategories',
            name='category',
            field=models.CharField(choices=[('Celebrity', 'Celebrity'), ('MovieSeries', 'MovieSeries'), ('Physiologies', 'Physiologies'), ('Gaming', 'Gaming')], default=None, max_length=200),
        ),
        migrations.AlterField(
            model_name='innercategories',
            name='title',
            field=models.CharField(default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='pointy_questions',
            name='category',
            field=models.CharField(choices=[('Celebrity', 'Celebrity'), ('MovieSeries', 'MovieSeries'), ('Physiologies', 'Physiologies'), ('Gaming', 'Gaming')], default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='questions',
            name='category',
            field=models.CharField(choices=[('Celebrity', 'Celebrity'), ('MovieSeries', 'MovieSeries'), ('Physiologies', 'Physiologies'), ('Gaming', 'Gaming')], default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='quizzes',
            name='category',
            field=models.CharField(choices=[('Celebrity', 'Celebrity'), ('MovieSeries', 'MovieSeries'), ('Physiologies', 'Physiologies'), ('Gaming', 'Gaming')], default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='quizzes_pointy',
            name='category',
            field=models.CharField(choices=[('Celebrity', 'Celebrity'), ('MovieSeries', 'MovieSeries'), ('Physiologies', 'Physiologies'), ('Gaming', 'Gaming')], default=None, max_length=100),
        ),
    ]