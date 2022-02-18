from django.contrib import admin
from django.db import models
from ckeditor.fields import RichTextField
import datetime
from django.contrib.auth.models import AbstractUser


categoryList = [
    ('celebrity', 'celebrity'),
    ('movie-series', 'movie-series'),
    ('psychology', 'psychology'),
    ('gaming', 'gaming'),
]

class CustomUser(AbstractUser):
    fav_color = models.CharField(blank=True, max_length=120)
    
class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser

class Document(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=80, null=False, blank=False, default=None)
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
    title = models.CharField(max_length=80, null=False, blank=False, default=None)
    thumbnail =  models.ImageField(upload_to='Thn-Category', null=True, blank=True, default='NotExist.jpg')
    background = models.ImageField(upload_to='Sub-Category', default='NotExist.jpg', help_text='background of choosing quizzes')
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
    title = models.CharField(max_length=80, null=False, blank=False, default=None)
    tags = models.CharField(max_length=100, null=False, blank=False, default='کوییز')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    thumbnail = models.ImageField(upload_to='QuizzesThumbnail', default='NotExist.jpg', help_text='thumbnail of quiz')
    background = models.ImageField(upload_to='QuizzesBackground', default='NotExist.jpg', help_text='background of playing quiz')
    fan_name = models.CharField(max_length=100, null=False, blank=False, default=None)
    GIF20 = models.ImageField(upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF40 = models.ImageField(upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF60 = models.ImageField(upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF80 = models.ImageField(upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF100 = models.ImageField(upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
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
    title = models.CharField(max_length=80, null=False, blank=False, default=None)
    tags = models.CharField(max_length=100, null=False, blank=False, default='کوییز')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    thumbnail = models.ImageField(upload_to='QuizzesThumbnail', default='NotExist.jpg', help_text='thumbnail of quiz')
    background = models.ImageField(upload_to='Quizzes', default='NotExist.jpg', help_text='background of playing quiz')
    publish = models.DateTimeField(default=datetime.datetime.now)

    result_upTo_1st = models.IntegerField(null=False, blank=False, default=None)
    result_upTo_2nd = models.IntegerField(null=False, blank=False, default=None)
    result_upTo_3rd = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_4th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_5th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_6th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_7th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_8th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_9th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_10th = models.IntegerField(blank=True, null=True, default=None)
    
    result_title_1st = models.CharField(max_length=200, null=False, blank=False, default=None)
    result_title_2nd = models.CharField(max_length=200, null=False, blank=False, default=None)
    result_title_3rd = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_4th = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_5th = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_6th = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_7th = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_8th = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_9th = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_title_10th = models.CharField(max_length=200, blank=True, null=True, default=None)

    result_text_1st = RichTextField(blank=True, null=True, default=None)
    result_text_2nd = RichTextField(blank=True, null=True, default=None)
    result_text_3rd = RichTextField(blank=True, null=True, default=None)
    result_text_4th = RichTextField(blank=True, null=True, default=None)
    result_text_5th = RichTextField(blank=True, null=True, default=None)
    result_text_6th = RichTextField(blank=True, null=True, default=None)
    result_text_7th = RichTextField(blank=True, null=True, default=None)
    result_text_8th = RichTextField(blank=True, null=True, default=None)
    result_text_9th = RichTextField(blank=True, null=True, default=None)
    result_text_10th = RichTextField(blank=True, null=True, default=None)

    result_img_1st =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_2nd =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_3rd =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_4th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_5th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_6th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_7th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_8th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_9th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_10th =  models.ImageField(upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')

    def __str__(self):
        return self.subCategory

class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'category', 'publish')
    search_fields = ['id', 'title']

class Questions(models.Model):
    id = models.AutoField(primary_key=True)
    subCategory = models.CharField(max_length=100, blank=False, default=None)
    title = models.CharField(max_length=80, blank=False, default=None, help_text='same quiz title')
    question = models.CharField(max_length=150, blank=True, default=None)
    question_img = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_1st = models.CharField(max_length=100, blank=True, default=None)
    option_2nd = models.CharField(max_length=100, blank=True, default=None)
    option_3rd = models.CharField(max_length=100, blank=True, default=None)
    option_4th = models.CharField(max_length=100, blank=True, default=None)
    option_img_1st = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_2nd = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_3rd = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_4th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    answer = models.IntegerField(blank=False, default=None)
    answer_imGif = models.ImageField(upload_to='Answer-And-Result-ImGIf', default='NotExist.jpg')
    answer_text = RichTextField(blank=True, default=None)

    def __str__(self):
        return self.subCategory

    def __unicode__(self):
        return 'test'

class Questions_Admin(admin.ModelAdmin):
    list_display = ('title', 'question', 'answer_text', 'subCategory')
    list_filter = ('subCategory', )
    search_fields = ['title', 'question']

class Pointy_Questions(models.Model):
    id = models.AutoField(primary_key=True)
    subCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=80, null=False, blank=False, default=None, help_text='same quiz title')
    question = models.CharField(max_length=150, null=True, blank=True, default=None)
    question_img = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')

    option_1st = models.CharField(max_length=100, blank=True)
    option_2nd = models.CharField(max_length=100, blank=True)
    option_3rd = models.CharField(max_length=100, blank=True)
    option_4th = models.CharField(max_length=100, blank=True)
    option_5th = models.CharField(max_length=100, blank=True)
    option_6th = models.CharField(max_length=100, blank=True)
    option_7th = models.CharField(max_length=100, blank=True)
    option_8th = models.CharField(max_length=100, blank=True)
    option_9th = models.CharField(max_length=100, blank=True)
    option_10th = models.CharField(max_length=100, blank=True)
    
    option_img_1st = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_2st = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_3rd = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_4th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_5th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_6th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_7th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_8th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_9th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_10th = models.ImageField(upload_to='Question-Option-Imgs', default='NotExist.jpg')
    
    option_point_1st = models.IntegerField(blank=True, default=1)
    option_point_2nd = models.IntegerField(blank=True, default=2)
    option_point_3rd = models.IntegerField(blank=True, default=3)
    option_point_4th = models.IntegerField(blank=True, default=4)
    option_point_5th = models.IntegerField(blank=True, default=5)
    option_point_6th = models.IntegerField(blank=True, default=6)
    option_point_7th = models.IntegerField(blank=True, default=7)
    option_point_8th = models.IntegerField(blank=True, default=8)
    option_point_9th = models.IntegerField(blank=True, default=9)
    option_point_10th = models.IntegerField(blank=True, default=10)

    def __str__(self):
        return self.subCategory

class Pointy_Questions_Admin(admin.ModelAdmin):
    list_display = ('title', 'question', 'subCategory')
    list_filter = ('subCategory',)
    search_fields = ['title', 'question']

class Blog(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=80, null=False, blank=False, default=None)
    thumbnail = models.ImageField(upload_to='QuizzesThumbnail', default='NotExist.jpg')
    content = RichTextField(blank=False, null=False, default=None)
    tags = models.CharField(max_length=100, null=False, blank=False, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    publish = models.DateTimeField(default=datetime.datetime.now)

class Blog_Admin(admin.ModelAdmin):
    list_display = ('title', 'monthly_views', 'views', 'publish')
    list_filter = ('tags', )
    search_field = ['title', 'publish']

# class Newsletter_Users(models.Model):
#     id  = models.AutoField(primary_key=True)
#     email = models.CharField(max_length=200, null=False, blank=False, default=None)
#     username = models.CharField(max_length=100, null=False, blank=False, default=None)
#     signedUp_On = models.DateTimeField(default=datetime.datetime.now)

#     def __str__(self):
#         return self.email

#     def __unicode__(self):
#         return 'test'

# class Newsletter_Users_Admin(admin.ModelAdmin):
#     list_display = ('email', 'username', 'signedUp_On')
#     list_filter = ('signedUp_On', )
#     search_fields = ['email', 'username']