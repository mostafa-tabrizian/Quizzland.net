#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.contrib import admin
from django.db import models
from ckeditor.fields import RichTextField
import datetime


categoryList = [
    ('celebrity', 'celebrity'),
    ('movie-series', 'movie-series'),
    ('psychology', 'psychology'),
    ('gaming', 'gaming'),
]

class Document(models.Model):
    id = models.AutoField(primary_key=True, null=False, blank=False, default=None)
    title = models.CharField(max_length=200, null=False, blank=False, default=None)
    note = models.TextField(blank=True, null=True, default=None)

    def __str__(self):
        return self.title
        
class Document_Admin(admin.ModelAdmin):
    list_display = ('title', 'note')
    search_fields = ['id', 'title', 'note']

class SubCategories(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=200, choices=categoryList, null=False, blank=False, default=None)
    subCategory = models.CharField(max_length=200, null=False, blank=False, default=None)
    title = models.CharField(max_length=200, null=False, blank=False, default=None)
    Thumbnail =  models.ImageField(upload_to='Thn-Category', null=True, blank=True, default='Base/NotExist.jpg')
    background = models.ImageField(upload_to='Sub-Category', default='Base/NotExist.jpg', help_text='background of choosing quizzes')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.subCategory

class SubCategories_Admin(admin.ModelAdmin):
    list_display = ('subCategory', 'title', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'category', 'publish')
    search_fields = ['id', 'title']

class Quizzes(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=100, choices=categoryList, null=False, blank=False, default=None)
    subCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    thumbnail = models.ImageField(upload_to='QuizzesThumbnail', default='Base/NotExist.jpg', help_text='thumbnail of quiz')
    background = models.ImageField(upload_to='QuizzesBackground', default='Base/NotExist.jpg', help_text='background of playing quiz')
    fan_name = models.CharField(max_length=100, null=False, blank=False, default=None)
    GIF20 = models.CharField(max_length=250, default='NotExist.jpg', help_text='title from Result_Gif files')
    GIF40 = models.CharField(max_length=250, default='NotExist.jpg', help_text='title from Result_Gif files')
    GIF60 = models.CharField(max_length=250, default='NotExist.jpg', help_text='title from Result_Gif files')
    GIF80 = models.CharField(max_length=250, default='NotExist.jpg', help_text='title from Result_Gif files')
    GIF100 = models.CharField(max_length=250, default='NotExist.jpg', help_text='title from Result_Gif files')
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.subCategory

    def __unicode__(self):
        return 'test'

class Quizzes_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'category', 'publish')
    search_fields = ['id', 'title']

class Quizzes_Pointy(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=100, choices=categoryList, null=False, blank=False, default=None)
    subCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    background = models.ImageField(upload_to='Quizzes', default='Base/NotExist.jpg', help_text='background of playing quiz and thumb nail of quiz')

    result_upTo_1 = models.IntegerField(null=False, blank=False, default=None)
    result_title_1 = models.CharField(max_length=200, null=False, blank=False, default=None)
    result_text_1 = RichTextField(blank=True, null=True, default=None)
    result_img_1 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_2 = models.IntegerField(null=False, blank=False, default=None)
    result_title_2 = models.CharField(max_length=200, null=False, blank=False, default=None)
    result_text_2 = RichTextField(blank=True, null=True, default=None)
    result_img_2 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_3 = models.IntegerField(blank=True, null=True, default=None)
    result_title_3 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_3 = RichTextField(blank=True, null=True, default=None)
    result_img_3 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_4 = models.IntegerField(blank=True, null=True, default=None)
    result_title_4 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_4 = RichTextField(blank=True, null=True, default=None)
    result_img_4 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_5 = models.IntegerField(blank=True, null=True, default=None)
    result_title_5 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_5 = RichTextField(blank=True, null=True, default=None)
    result_img_5 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_6 = models.IntegerField(blank=True, null=True, default=None)
    result_title_6 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_6 = RichTextField(blank=True, null=True, default=None)
    result_img_6 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_7 = models.IntegerField(blank=True, null=True, default=None)
    result_title_7 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_7 = RichTextField(blank=True, null=True, default=None)
    result_img_7 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_8 = models.IntegerField(blank=True, null=True, default=None)
    result_title_8 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_8 = RichTextField(blank=True, null=True, default=None)
    result_img_8 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_9 = models.IntegerField(blank=True, null=True, default=None)
    result_title_9 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_9 = RichTextField(blank=True, null=True, default=None)
    result_img_9 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')
    
    result_upTo_10 = models.IntegerField(blank=True, null=True, default=None)
    result_title_10 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_10 = RichTextField(blank=True, null=True, default=None)
    result_img_10 =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='Base/NotExist.jpg')

    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.subCategory

class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'category', 'publish')
    search_fields = ['id', 'title']

class Questions(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=100, choices=categoryList, null=False, blank=False, default=None)
    subCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=200, null=False, blank=False, default=None, help_text='same quiz title')
    question = models.CharField(max_length=200, null=True, blank=True, default=None)
    question_img = models.ImageField(upload_to='Question-Option-Imgs', default='Base/NotExist.jpg')
    option_1 = models.CharField(max_length=100, null=False, blank=False, default=None)
    option_2 = models.CharField(max_length=100, null=False, blank=False, default=None)
    option_3 = models.CharField(max_length=100, null=False, blank=True, default=None)
    option_4 = models.CharField(max_length=100, null=False, blank=True, default=None)
    option_1_img = models.ImageField(upload_to='Question-Option-Imgs', default='Base/NotExist.jpg')
    option_2_img = models.ImageField(upload_to='Question-Option-Imgs', default='Base/NotExist.jpg')
    option_3_img = models.ImageField(upload_to='Question-Option-Imgs', default='Base/NotExist.jpg')
    option_4_img = models.ImageField(upload_to='Question-Option-Imgs', default='Base/NotExist.jpg')
    answer = models.IntegerField(null=False, blank=False, default=None)
    answer_imGif = models.ImageField(upload_to='Answer-And-Result-ImGIf', default='Base/NotExist.jpg')
    answer_text = RichTextField(blank=True, null=True, default=None)

    def __str__(self):
        return self.subCategory

    def __unicode__(self):
        return 'test'

class Questions_Admin(admin.ModelAdmin):
    list_display = ('title', 'question', 'subCategory', 'category')
    list_filter = ('subCategory', 'category')
    search_fields = ['title', 'question']

class Pointy_Questions(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=100, choices=categoryList, null=False, blank=False, default=None)
    subCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None, help_text='same quiz title')
    question = models.CharField(max_length=200, null=False, blank=False, default=None)

    option_Value_1 = models.CharField(max_length=100, null=False, blank=False, default=None)
    option_Point_1 = models.IntegerField(null=False, blank=False, default=None)
    
    option_Value_2 = models.CharField(max_length=100, null=False, blank=False, default=None)
    option_Point_2 = models.IntegerField(null=False, blank=False, default=None)
    
    option_Value_3 = models.CharField(max_length=100, blank=True)
    option_Point_3 = models.IntegerField(null=False, blank=True, default=None)
    
    option_Value_4 = models.CharField(max_length=100, blank=True)
    option_Point_4 = models.IntegerField(null=True, blank=True, default=None)
    
    option_Value_5 = models.CharField(max_length=100, blank=True)
    option_Point_5 = models.IntegerField(null=True, blank=True, default=None)
    
    option_Value_6 = models.CharField(max_length=100, blank=True)
    option_Point_6 = models.IntegerField(null=True, blank=True, default=None)
    
    option_Value_7 = models.CharField(max_length=100, blank=True)
    option_Point_7 = models.IntegerField(null=True, blank=True, default=None)
    
    option_Value_8 = models.CharField(max_length=100, blank=True)
    option_Point_8 = models.IntegerField(null=True, blank=True, default=None)
    
    option_Value_9 = models.CharField(max_length=100, blank=True)
    option_Point_9 = models.IntegerField(null=True, blank=True, default=None)
    
    option_Value_10 = models.CharField(max_length=100, blank=True)
    option_Point_10 = models.IntegerField(null=True, blank=True, default=None)

    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.subCategory

class Pointy_Questions_Admin(admin.ModelAdmin):
    list_display = ('title', 'question', 'subCategory', 'category', 'publish')
    list_filter = ('subCategory', 'category')
    search_fields = ['title', 'question']

class Newsletter_Users(models.Model):
    id  = models.AutoField(primary_key=True)
    email = models.CharField(max_length=200, null=False, blank=False, default=None)
    username = models.CharField(max_length=100, null=False, blank=False, default=None)
    signedUp_On = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.email

    def __unicode__(self):
        return 'test'

class Newsletter_Users_Admin(admin.ModelAdmin):
    list_display = ('email', 'username', 'signedUp_On')
    list_filter = ('signedUp_On', )
    search_fields = ['email', 'username']

class Result_gif(models.Model):
    title = models.CharField(max_length=150, null=True, blank=False)
    subCategory = models.CharField(max_length=150, null=True, blank=False)
    gif = models.ImageField(upload_to='Answer-And-Result-ImGIf/', default='Base/NotExist.jpg')

    def __str__(self):
        return 'Result gif created'

class Result_gif_Admin(admin.ModelAdmin):
    list_display = ('title', )
    list_filter = ('subCategory', )
    search_fields = ['subCategory']