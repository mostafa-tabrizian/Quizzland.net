from pkg_resources import require
from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.forms.widgets import TextInput

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
            'password',
            'is_active',
            'date_joined',
            'last_login',
            'pass_token',
            'avatar',
            'bio',
            'birthday_date',
            'gender',
            'most_played_categories',
            'played_history',
            'liked_quizzes',
            'watch_list',
            'points'
        )
        
    def create(self, request):
        userData = request
        
        newUser = CustomUser.objects.create(
            username=userData['username'],
            email=userData['email']
        )
        
        newUser.set_password(userData['password'])
        newUser.save()
        
        return newUser

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = (
            '__all__'
        )

class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategories
        fields = (
            '__all__'
        )

    categoryKey = CategoriesSerializer(many=False, read_only=True)

class QuizzesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quizzes
        fields = (
            '__all__'
        )
        
    categoryKey = CategoriesSerializer(many=False, read_only=True)

class PointyQuizzesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quizzes_Pointy
        fields = (
            '__all__'
        )
              
    categoryKey = CategoriesSerializer(many=False, read_only=True)

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = (
            '__all__'
        )
        
    submitter_related = CustomUserSerializer(many=False)
    
    def create(self, request):
        CommentData = request
        
        newComment = Comments.objects.create(
            comment_text=CommentData['comment_text'],
            quiz_related=CommentData['quiz_related'],
            test_related=CommentData['test_related'],
            submitter_related=CustomUser.objects.get(id=CommentData['submitter_related']['username']),
        )
        
        return newComment

class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = (
            '__all__'
        )
        
        quizKey = QuizzesSerializer(many=False)

class questions_pointySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pointy_Questions
        fields = (
            '__all__'
        )
        
    quizKey = QuizzesSerializer(many=False)


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = (
            '__all__'
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