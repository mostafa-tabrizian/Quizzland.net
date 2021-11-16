# Generated by Django 3.2.9 on 2021-11-09 16:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0017_alter_profile_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='authenticated',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='firstname',
            field=models.CharField(default=None, max_length=100),
        ),
        migrations.AddField(
            model_name='profile',
            name='lastname',
            field=models.CharField(default=None, max_length=100),
        ),
        migrations.AddField(
            model_name='profile',
            name='newsletter',
            field=models.CharField(choices=[('On', 'On'), ('Off', 'Off')], default='Off', max_length=100),
        ),
        migrations.AddField(
            model_name='profile',
            name='redFlag',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='profile',
            name='email',
            field=models.CharField(default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='profile',
            name='username',
            field=models.CharField(default=None, max_length=100),
        ),
    ]