from django.db import models
import datetime


class Document(models.Model):
    id = models.AutoField(primary_key=True, default=None)
    title = models.CharField(max_length=200, default=None)
    note = models.TextField(max_length=200, default=None)

    def __str__(self):
        return self.title

class InnerCategories(models.Model):
    id = models.AutoField(primary_key=True, default=None)
    category = models.CharField(max_length=200, default=None)
    innerCategory = models.CharField(max_length=200, default=None)
    title = models.CharField(max_length=200, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.innerCategory

class Quizzes(models.Model):
    category = models.CharField(max_length=100, default=None)
    innerCategory = models.CharField(max_length=100, default=None)
    title = models.CharField(max_length=100, default=None)
    title_english = models.CharField(max_length=100, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    background = models.CharField(max_length=100)
    fan_name = models.CharField(max_length=100)
    GIF20 = models.CharField(max_length=200, default='empty.jpg')
    GIF40 = models.CharField(max_length=200, default='empty.jpg')
    GIF60 = models.CharField(max_length=200, default='empty.jpg')
    GIF80 = models.CharField(max_length=200, default='empty.jpg')
    GIF100 = models.CharField(max_length=200, default='empty.jpg')
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.title_english


class Quizzes_Pointy(models.Model):
    category = models.CharField(max_length=100, default=None)
    innerCategory = models.CharField(max_length=100, default=None)
    title = models.CharField(max_length=100, default=None)
    title_english = models.CharField(max_length=100, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    background = models.CharField(max_length=100)

    result_upTo_1 = models.IntegerField(default=None)
    result_title_1 = models.CharField(max_length=200)
    result_text_1 = models.TextField(default=None)
    result_img_1 =  models.CharField(max_length=100)
    
    result_upTo_2 = models.IntegerField(default=None)
    result_title_2 = models.CharField(max_length=200)
    result_text_2 = models.TextField(default=None)
    result_img_2 =  models.CharField(max_length=100)
    
    result_upTo_3 = models.IntegerField(default=None, blank=True, null=True)
    result_title_3 = models.CharField(max_length=200, blank=True, null=True)
    result_text_3 = models.TextField(default=None, blank=True, null=True)
    result_img_3 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_4 = models.IntegerField(default=None, blank=True, null=True)
    result_title_4 = models.CharField(max_length=200, blank=True, null=True)
    result_text_4 = models.TextField(default=None, blank=True, null=True)
    result_img_4 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_5 = models.IntegerField(default=None, blank=True, null=True)
    result_title_5 = models.CharField(max_length=200, blank=True, null=True)
    result_text_5 = models.TextField(default=None, blank=True, null=True)
    result_img_5 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_6 = models.IntegerField(default=None, blank=True, null=True)
    result_title_6 = models.CharField(max_length=200, blank=True, null=True)
    result_text_6 = models.TextField(default=None, blank=True, null=True)
    result_img_6 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_7 = models.IntegerField(default=None, blank=True, null=True)
    result_title_7 = models.CharField(max_length=200, blank=True, null=True)
    result_text_7 = models.TextField(default=None, blank=True, null=True)
    result_img_7 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_8 = models.IntegerField(default=None, blank=True, null=True)
    result_title_8 = models.CharField(max_length=200, blank=True, null=True)
    result_text_8 = models.TextField(default=None, blank=True, null=True)
    result_img_8 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_9 = models.IntegerField(default=None, blank=True, null=True)
    result_title_9 = models.CharField(max_length=200, blank=True, null=True)
    result_text_9 = models.TextField(default=None, blank=True, null=True)
    result_img_9 =  models.CharField(max_length=100, blank=True, null=True)
    
    result_upTo_10 = models.IntegerField(default=None, blank=True, null=True)
    result_title_10 = models.CharField(max_length=200, blank=True, null=True)
    result_text_10 = models.TextField(default=None, blank=True, null=True)
    result_img_10 =  models.CharField(max_length=100, blank=True, null=True)

    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.title_english


class Quiz_Questions(models.Model):
    category = models.CharField(max_length=100, default=None)
    innerCategory = models.CharField(max_length=100, default=None)
    title = models.CharField(max_length=100, default=None)
    title_english = models.CharField(max_length=100, default=None)
    question = models.TextField(default=None)
    option_1 = models.CharField(max_length=100, default=None)
    option_2 = models.CharField(max_length=100, default=None)
    option_3 = models.CharField(max_length=100, default=None, blank=True)
    option_4 = models.CharField(max_length=100, default=None, blank=True)
    answer = models.IntegerField(default=1)
    answer_imGif = models.CharField(max_length=200, default=None)
    answer_text = models.TextField(default=None)

    def __str__(self):
        return self.title_english


class Quiz_Pointy_Questions(models.Model):
    category = models.CharField(max_length=100, default=None)
    innerCategory = models.CharField(max_length=100, default=None)
    title = models.CharField(max_length=100, default=None)
    title_english = models.CharField(max_length=100, default=None)
    question = models.CharField(max_length=200, default=None)

    option_Value_1 = models.CharField(max_length=100)
    option_Point_1 = models.IntegerField(default=1)
    
    option_Value_2 = models.CharField(max_length=100)
    option_Point_2 = models.IntegerField(default=1)
    
    option_Value_3 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_3 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_4 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_4 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_5 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_5 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_6 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_6 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_7 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_7 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_8 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_8 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_9 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_9 = models.IntegerField(default=1, blank=True, null=True)
    
    option_Value_10 = models.CharField(max_length=100, blank=True, null=True)
    option_Point_10 = models.IntegerField(default=1, blank=True, null=True)

    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.title_english


class Newsletter(models.Model):
    email = models.CharField(max_length=200, default=None)
    username = models.CharField(max_length=100, default=None)
    favorite_Category = models.CharField(max_length=200, default=None)
    signedUp_On = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.email