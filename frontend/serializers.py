from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        # token['id'] = user.id
        # token['username'] = user.username
        # token['pass_token'] = user.pass_token
        # token['first_name'] = user.first_name
        # token['last_name'] = user.last_name
        # token['email'] = user.email
        # token['is_active'] = user.is_active
        # token['date_joined'] = user.date_joined
        # token['last_login'] = user.last_login
        # token['pass_token'] = user.pass_token
        # token['avatar'] = user.avatar
        # token['bio'] = user.bio
        # token['birthday_date'] = user.birthday_date
        # token['gender'] = user.gender
        # token['most_played_categories'] = user.most_played_categorie
        return token

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'pass_token',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'date_joined',
            'last_login',
            'pass_token',
            'avatar',
            'bio',
            'birthday_date',
            'gender',
            'most_played_categories'
        )

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = (
            'id',
            'title_english',
            'title_persian',
            'monthly_views',
            'views',
            'publish',
        )

class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategories
        fields = (
            'id',
            'public',
            'categoryKey',
            'subCategory',
            'title',
            'thumbnail',
            'background',
            'monthly_views',
            'views',
            'publish'
        )

    categoryKey = CategoriesSerializer(many=False, read_only=True)

class QuizzesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quizzes
        fields = (
            'id',
            'public',
            'categoryKey',
            'subCategory',
            'rate',
            'rate_count',
            'slug',
            'title',
            'tags',
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
        
    categoryKey = CategoriesSerializer(many=False, read_only=True)

class PointyQuizzesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quizzes_Pointy
        fields = (
            'id',
            'public',
            'categoryKey',
            'subCategory',
            'rate',
            'rate_count',
            'slug',
            'title',
            'tags',
            'monthly_views',
            'views',
            'thumbnail',
            'background',
            'publish',
            'result_upTo_1st',
            'result_img_1st',
            'result_title_1st',
            'result_text_1st',
                
            'result_upTo_2nd',
            'result_img_2nd',
            'result_title_2nd',
            'result_text_2nd',
                
            'result_upTo_3rd',
            'result_img_3rd',
            'result_title_3rd',
            'result_text_3rd',
                
            'result_upTo_4th',
            'result_img_4th',
            'result_title_4th',
            'result_text_4th',
                
            'result_upTo_5th',
            'result_img_5th',
            'result_title_5th',
            'result_text_5th',
                
            'result_upTo_6th',
            'result_img_6th',
            'result_title_6th',
            'result_text_6th',
                
            'result_upTo_7th',
            'result_img_7th',
            'result_title_7th',
            'result_text_7th',
                
            'result_upTo_8th',
            'result_img_8th',
            'result_title_8th',
            'result_text_8th',
                
            'result_upTo_9th',
            'result_img_9th',
            'result_title_9th',
            'result_text_9th',
                
            'result_upTo_10th',
            'result_img_10th',
            'result_title_10th',
            'result_text_10th',
        )
              
    categoryKey = CategoriesSerializer(many=False, read_only=True)

class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = (
            'id',
            'quizKey',
            'question',
            'question_img',
            'option_1st',
            'option_2nd',
            'option_3rd',
            'option_4th',
            'option_img_1st',
            'option_img_2nd',
            'option_img_3rd',
            'option_img_4th',
            'answer',
            'answer_imGif',
            'answer_text'
        )
        
        quizKey = QuizzesSerializer(many=False)

class questions_pointySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pointy_Questions
        fields = (
            'id',
            'quizKey',
            'question',
            'question_img',
            'option_1st',
            'option_img_1st',
            'option_point_1st',
                
            'option_2nd',
            'option_img_2st',
            'option_point_2nd',
                
            'option_3rd',
            'option_img_3rd',
            'option_point_3rd',
                
            'option_4th',
            'option_img_4th',
            'option_point_4th',
                
            'option_5th',
            'option_img_5th',
            'option_point_5th',
                
            'option_6th',
            'option_img_6th',
            'option_point_6th',
                
            'option_7th',
            'option_img_7th',
            'option_point_7th',
                
            'option_8th',
            'option_img_8th',
            'option_point_8th',
                
            'option_9th',
            'option_img_9th',
            'option_point_9th',
                
            'option_10th',
            'option_img_10th',
            'option_point_10th',
        )
        
    quizKey = QuizzesSerializer(many=False)


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = (
            'id',
            'title',
            'thumbnail',
            'content',
            'tags',
            'monthly_views',
            'views',
            'publish'
        )

# class NewsletterUsersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Newsletter_Users
#         fields = (
#             'id',
#             'email',
#             'username',
#             'signedUp_On'
#         )