from .models import *

from django.utils.translation import ugettext as _

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        return token

class CustomJWTSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        credentials = {
            'username': '',
            'password': attrs.get("password")
        }

        user_obj = CustomUser.objects.filter(email=attrs.get("username")).first() or CustomUser.objects.filter(username=attrs.get("username")).first()
        if user_obj:
            credentials['username'] = user_obj.username

        return super().validate(credentials)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'avatar',
            'bio',
            'points',
            'most_played_categories',
            'liked_quizzes',
            'played_history',
            'watch_list',
            'is_active',
        )
    
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            '__all__'
        )
    
    # def update(self, instance, validated_data):
    #     instance.has_read = validated_data['has_read']
    #     instance.save()
        
    #     return instance

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
            verified=CommentData['verified'],
            submitter_related=CustomUser.objects.get(id=(self.context['request'].data['submitter_related']['username'])),
        )
        
        return newComment

class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = (
            '__all__'
        )
        
        quizKey = QuizzesSerializer(many=False)

class questionsPointySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pointy_Questions
        fields = (
            '__all__'
        )
        
    quizKey = QuizzesSerializer(many=False)


# class BlogSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Blog
#         fields = (
#             '__all__'
#         )

# class NewsletterUsersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Newsletter_Users
#         fields = (
#             'id',
#             'email',
#             'username',
#             'signedUp_On'
#         )