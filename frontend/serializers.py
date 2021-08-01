from rest_framework import serializers
from .models import *


class QuizzesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quizzes
        fields = (
            'id',
            'category',
            'subCategory',
            'title',
            'monthly_views',
            'views',
            'thumbnail',
            'background',
            'fan_name',
            'GIF20',
            'GIF40',
            'GIF60', 
            'GIF80',
            'GIF100', 
            'publish',
        )

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategories
        fields = (
            'id',
            'category',
            'subCategory',
            'title',
            'thumbnail',
            'background',
            'monthly_views',
            'views',
            'publish'
        )

class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = (
            'id',
            'subCategory' ,
            'title',
            'question',
            'question_img',
            'option_1',
            'option_2',
            'option_3',
            'option_4',
            'option_1_img',
            'option_2_img',
            'option_3_img',
            'option_4_img',
            'answer',
            'answer_imGif',
            'answer_text'
        )

class NewsletterUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter_Users
        fields = (
            'id',
            'email',
            'username',
            'signedUp_On'
        )