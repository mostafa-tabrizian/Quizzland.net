from django.contrib import admin
from django.db import models
import datetime


class Document(models.Model):
    id = models.AutoField(primary_key=True, null=False, blank=False, default=None)
    title = models.CharField(max_length=200, null=False, blank=False, default=None)
    note = models.TextField(max_length=200, null=False, blank=False, default=None)

    def __str__(self):
        return self.title
        
class Document_Admin(admin.ModelAdmin):
    list_display = ('title', 'note')


class InnerCategories(models.Model):
    id = models.AutoField(primary_key=True, null=False, blank=False, default=None)
    category = models.CharField(max_length=200, null=False, blank=False, default=None)
    innerCategory = models.CharField(max_length=200, null=False, blank=False, default=None)
    title = models.CharField(max_length=200, null=False, blank=False, default=None)
    background = models.ImageField(upload_to='app/static/img/Inner-Category', default='app/static/img/Base/NotExist.jpg')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.innerCategory

class InnerCategory_Admin(admin.ModelAdmin):
    list_display = ('innerCategory', 'title', 'category', 'monthly_views', 'views', 'publish')

class Quizzes(models.Model):
    category = models.CharField(max_length=100, null=False, blank=False, default=None)
    innerCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    background = models.ImageField(upload_to='app/static/img/Quizzes', default='app/static/img/Base/NotExist.jpg')
    fan_name = models.CharField(max_length=100, null=False, blank=False, default=None)
    GIF20 = models.ImageField(upload_to='app/static/img/Answer-And-Result-ImGIf', default='app/static/img/Base/NotExist.jpg')
    GIF40 = models.ImageField(upload_to='app/static/img/Answer-And-Result-ImGIf', default='app/static/img/Base/NotExist.jpg')
    GIF60 = models.ImageField(upload_to='app/static/img/Answer-And-Result-ImGIf', default='app/static/img/Base/NotExist.jpg')
    GIF80 = models.ImageField(upload_to='app/static/img/Answer-And-Result-ImGIf', default='app/static/img/Base/NotExist.jpg')
    GIF100 = models.ImageField(upload_to='app/static/img/Answer-And-Result-ImGIf', default='app/static/img/Base/NotExist.jpg')
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.innerCategory

    def __unicode__(self):
        return 'test'

class Quizzes_Admin(admin.ModelAdmin):
    list_display = ('title', 'innerCategory', 'category', 'monthly_views', 'views', 'publish')

class Quizzes_Pointy(models.Model):
    category = models.CharField(max_length=100, null=False, blank=False, default=None)
    innerCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    background = models.ImageField(upload_to='app/static/img/Quizzes', default='app/static/img/Base/NotExist.jpg')

    result_upTo_1 = models.IntegerField(null=False, blank=False, default=None)
    result_title_1 = models.CharField(max_length=200, null=False, blank=False, default=None)
    result_text_1 = models.TextField(null=False, blank=False, default=None)
    result_img_1 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_2 = models.IntegerField(null=False, blank=False, default=None)
    result_title_2 = models.CharField(max_length=200, null=False, blank=False, default=None)
    result_text_2 = models.TextField(null=False, blank=False, default=None)
    result_img_2 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_3 = models.IntegerField(blank=True, null=True, default=None)
    result_title_3 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_3 = models.TextField(blank=True, default=None)
    result_img_3 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_4 = models.IntegerField(blank=True, null=True, default=None)
    result_title_4 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_4 = models.TextField(blank=True, default=None)
    result_img_4 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_5 = models.IntegerField(blank=True, null=True, default=None)
    result_title_5 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_5 = models.TextField(blank=True, default=None)
    result_img_5 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_6 = models.IntegerField(blank=True, null=True, default=None)
    result_title_6 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_6 = models.TextField(blank=True, default=None)
    result_img_6 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_7 = models.IntegerField(blank=True, null=True, default=None)
    result_title_7 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_7 = models.TextField(blank=True, default=None)
    result_img_7 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_8 = models.IntegerField(blank=True, null=True, default=None)
    result_title_8 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_8 = models.TextField(blank=True, default=None)
    result_img_8 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_9 = models.IntegerField(blank=True, null=True, default=None)
    result_title_9 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_9 = models.TextField(blank=True, default=None)
    result_img_9 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')
    
    result_upTo_10 = models.IntegerField(blank=True, null=True, default=None)
    result_title_10 = models.CharField(max_length=200, blank=True, null=True, default=None)
    result_text_10 = models.TextField(blank=True, default=None)
    result_img_10 =  models.ImageField(upload_to='app/static/img/Pointy-Quiz-Result', null=True, blank=True, default='app/static/img/Base/NotExist.jpg')

    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.innerCategory

class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'innerCategory', 'category', 'monthly_views', 'views', 'publish')

class Questions(models.Model):
    category = models.CharField(max_length=100, null=False, blank=False, default=None)
    innerCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None)
    question = models.TextField(null=False, blank=False, default=None)
    option_1 = models.CharField(max_length=100, null=False, blank=False, default=None)
    option_2 = models.CharField(max_length=100, null=False, blank=False, default=None)
    option_3 = models.CharField(max_length=100, null=False, blank=True, default=None)
    option_4 = models.CharField(max_length=100, null=False, blank=True, default=None)
    answer = models.IntegerField(null=False, blank=False, default=None)
    answer_imGif = models.ImageField(upload_to='app/static/img/Answer-And-Result-ImGIf', default='app/static/img/Base/NotExist.jpg')
    answer_text = models.TextField(null=False, blank=True, default=None)

    def __str__(self):
        return self.innerCategory

    def __unicode__(self):
        return 'test'

class Questions_Admin(admin.ModelAdmin):
    list_display = ('title', 'question', 'innerCategory', 'category')

class Pointy_Questions(models.Model):
    category = models.CharField(max_length=100, null=False, blank=False, default=None)
    innerCategory = models.CharField(max_length=100, null=False, blank=False, default=None)
    title = models.CharField(max_length=100, null=False, blank=False, default=None)
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
        return self.innerCategory

class Pointy_Questions_Admin(admin.ModelAdmin):
    list_display = ('title', 'question', 'innerCategory', 'category', 'publish')

class Newsletter_Users(models.Model):
    email = models.CharField(max_length=200, null=False, blank=False, default=None)
    username = models.CharField(max_length=100, null=False, blank=False, default=None)
    favorite_Category = models.CharField(max_length=200, null=False, blank=False, default=None)
    signedUp_On = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.email

    def __unicode__(self):
        return 'test'

class Newsletter_Users_Admin(admin.ModelAdmin):
    list_display = ('email', 'username', 'favorite_Category', 'signedUp_On')