# Generated by Django 3.2.9 on 2021-11-30 16:24

import ckeditor.fields
import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(default=None, max_length=80)),
                ('thumbnail', models.ImageField(default='NotExist.jpg', upload_to='QuizzesThumbnail')),
                ('content', ckeditor.fields.RichTextField(default=None)),
                ('tags', models.CharField(default=None, max_length=100)),
                ('monthly_views', models.IntegerField(default=0)),
                ('views', models.IntegerField(default=0)),
                ('publish', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(default=None, max_length=80)),
                ('note', models.TextField(blank=True, default=None, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pointy_Questions',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('subCategory', models.CharField(default=None, max_length=100)),
                ('title', models.CharField(default=None, help_text='same quiz title', max_length=80)),
                ('question', models.CharField(blank=True, default=None, max_length=150, null=True)),
                ('question_img', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_1st', models.CharField(blank=True, max_length=100)),
                ('option_2nd', models.CharField(blank=True, max_length=100)),
                ('option_3rd', models.CharField(blank=True, max_length=100)),
                ('option_4th', models.CharField(blank=True, max_length=100)),
                ('option_5th', models.CharField(blank=True, max_length=100)),
                ('option_6th', models.CharField(blank=True, max_length=100)),
                ('option_7th', models.CharField(blank=True, max_length=100)),
                ('option_8th', models.CharField(blank=True, max_length=100)),
                ('option_9th', models.CharField(blank=True, max_length=100)),
                ('option_10th', models.CharField(blank=True, max_length=100)),
                ('option_img_1st', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_2st', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_3rd', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_4th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_5th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_6th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_7th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_8th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_9th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_10th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_point_1st', models.IntegerField(blank=True, default=1, null=True)),
                ('option_point_2nd', models.IntegerField(blank=True, default=2, null=True)),
                ('option_point_3rd', models.IntegerField(blank=True, default=3, null=True)),
                ('option_point_4th', models.IntegerField(blank=True, default=4, null=True)),
                ('option_point_5th', models.IntegerField(blank=True, default=5, null=True)),
                ('option_point_6th', models.IntegerField(blank=True, default=6, null=True)),
                ('option_point_7th', models.IntegerField(blank=True, default=7, null=True)),
                ('option_point_8th', models.IntegerField(blank=True, default=8, null=True)),
                ('option_point_9th', models.IntegerField(blank=True, default=9, null=True)),
                ('option_point_10th', models.IntegerField(blank=True, default=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(default=None, max_length=100, unique=True)),
                ('firstname', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('lastname', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('email', models.CharField(default=None, max_length=100, unique=True)),
                ('password', models.CharField(default=None, max_length=200)),
                ('avatar', models.ImageField(default='defaultAvatar.jpg', upload_to='profileAvatars')),
                ('joinedDate', models.DateTimeField(default=datetime.datetime.now)),
                ('birthday', models.DateTimeField(blank=True, null=True)),
                ('bio', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('redFlag', models.IntegerField(default=0)),
                ('points', models.IntegerField(default=0)),
                ('comments', models.TextField(blank=True, default=None, null=True)),
                ('categoryHistory', models.TextField(blank=True, default=None, null=True)),
                ('saveList', models.TextField(blank=True, default=None, null=True)),
                ('playedQuizzesCounter', models.IntegerField(default=0)),
                ('averageScoreResult', models.IntegerField(default=0)),
                ('inviteUrl', models.URLField(blank=True, default=None, null=True)),
                ('authenticated', models.BooleanField(default=True)),
                ('newsletter', models.BooleanField(default=False)),
                ('gender', models.CharField(choices=[('Male', 'مذکر'), ('Female', 'مؤنث'), ('PreferNotToSay', 'ترجیح میدم نگم')], default='Male', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Questions',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('subCategory', models.CharField(default=None, max_length=100)),
                ('title', models.CharField(default=None, help_text='same quiz title', max_length=80)),
                ('question', models.CharField(blank=True, default=None, max_length=150, null=True)),
                ('question_img', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_1st', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('option_2nd', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('option_3rd', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('option_4th', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('option_img_1st', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_2nd', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_3rd', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('option_img_4th', models.ImageField(default='NotExist.jpg', upload_to='Question-Option-Imgs')),
                ('answer', models.IntegerField(default=None)),
                ('answer_imGif', models.ImageField(default='NotExist.jpg', upload_to='Answer-And-Result-ImGIf')),
                ('answer_text', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Quizzes',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('category', models.CharField(choices=[('celebrity', 'celebrity'), ('movie-series', 'movie-series'), ('psychology', 'psychology'), ('gaming', 'gaming')], default=None, max_length=100)),
                ('subCategory', models.CharField(default=None, max_length=100)),
                ('title', models.CharField(default=None, max_length=80)),
                ('tags', models.CharField(default='کوییز', max_length=100)),
                ('monthly_views', models.IntegerField(default=0)),
                ('views', models.IntegerField(default=0)),
                ('thumbnail', models.ImageField(default='NotExist.jpg', help_text='thumbnail of quiz', upload_to='QuizzesThumbnail')),
                ('background', models.ImageField(default='NotExist.jpg', help_text='background of playing quiz', upload_to='QuizzesBackground')),
                ('fan_name', models.CharField(default=None, max_length=100)),
                ('GIF20', models.ImageField(default='NotExist.jpg', upload_to='Answer-And-Result-ImGIf/')),
                ('GIF40', models.ImageField(default='NotExist.jpg', upload_to='Answer-And-Result-ImGIf/')),
                ('GIF60', models.ImageField(default='NotExist.jpg', upload_to='Answer-And-Result-ImGIf/')),
                ('GIF80', models.ImageField(default='NotExist.jpg', upload_to='Answer-And-Result-ImGIf/')),
                ('GIF100', models.ImageField(default='NotExist.jpg', upload_to='Answer-And-Result-ImGIf/')),
                ('publish', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
        migrations.CreateModel(
            name='Quizzes_Pointy',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('category', models.CharField(choices=[('celebrity', 'celebrity'), ('movie-series', 'movie-series'), ('psychology', 'psychology'), ('gaming', 'gaming')], default=None, max_length=100)),
                ('subCategory', models.CharField(default=None, max_length=100)),
                ('title', models.CharField(default=None, max_length=80)),
                ('tags', models.CharField(default='کوییز', max_length=100)),
                ('monthly_views', models.IntegerField(default=0)),
                ('views', models.IntegerField(default=0)),
                ('thumbnail', models.ImageField(default='NotExist.jpg', help_text='thumbnail of quiz', upload_to='QuizzesThumbnail')),
                ('background', models.ImageField(default='NotExist.jpg', help_text='background of playing quiz', upload_to='Quizzes')),
                ('publish', models.DateTimeField(default=datetime.datetime.now)),
                ('result_upTo_1st', models.IntegerField(default=None)),
                ('result_upTo_2nd', models.IntegerField(default=None)),
                ('result_upTo_3rd', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_4th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_5th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_6th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_7th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_8th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_9th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_upTo_10th', models.IntegerField(blank=True, default=None, null=True)),
                ('result_title_1st', models.CharField(default=None, max_length=200)),
                ('result_title_2nd', models.CharField(default=None, max_length=200)),
                ('result_title_3rd', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_4th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_5th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_6th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_7th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_8th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_9th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_title_10th', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('result_text_1st', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_2nd', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_3rd', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_4th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_5th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_6th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_7th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_8th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_9th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_text_10th', ckeditor.fields.RichTextField(blank=True, default=None, null=True)),
                ('result_img_1st', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_2nd', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_3rd', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_4th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_5th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_6th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_7th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_8th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_9th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
                ('result_img_10th', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Pointy-Quiz-Result')),
            ],
        ),
        migrations.CreateModel(
            name='SubCategories',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('category', models.CharField(choices=[('celebrity', 'celebrity'), ('movie-series', 'movie-series'), ('psychology', 'psychology'), ('gaming', 'gaming')], default=None, max_length=200)),
                ('subCategory', models.CharField(default=None, max_length=200)),
                ('title', models.CharField(default=None, max_length=80)),
                ('thumbnail', models.ImageField(blank=True, default='NotExist.jpg', null=True, upload_to='Thn-Category')),
                ('background', models.ImageField(default='NotExist.jpg', help_text='background of choosing quizzes', upload_to='Sub-Category')),
                ('monthly_views', models.IntegerField(default=0)),
                ('views', models.IntegerField(default=0)),
                ('publish', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
    ]
