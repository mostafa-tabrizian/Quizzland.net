from .models import *
from django.db.models import Q
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

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            '__all__'
        )
        
    submitter_id = CustomUserSerializer(many=False)
    
    def create(self, request):
        CommentData = request
        
        newComment = Comment.objects.create(
            comment_text=CommentData['comment_text'],
            trivia_id=CommentData['trivia_id'],
            test_id=CommentData['test_id'],
            verified=CommentData['verified'],
            submitter_id=CustomUser.objects.get(id=(self.context['request'].data['submitter_id']['username'])),
        )
        
        return newComment

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = (
            '__all__'
        )
        
    user_id = CustomUserSerializer(many=False)
    trivia_id = QuizzesSerializer(many=False)
    test_id = PointyQuizzesSerializer(many=False)
    
    def create(self, request):
        
        request_user_id = self.context['request'].data['user_id']['username']
        request_trivia_id = self.context['request'].data['trivia_id']['id']
        request_test_id = self.context['request'].data['test_id']['id']
        
        userDidLikeForThisQuiz = Like.objects.filter(Q(user_id=request_user_id), Q(trivia_id=request_trivia_id) | Q(test_id=request_test_id))
        
        if (not userDidLikeForThisQuiz.exists()):
            newLike = Like.objects.create(
                user_id=(CustomUser.objects.get(id=(self.context['request'].data['user_id']['username']))),
                trivia_id=(Quizzes.objects.get(id=request_trivia_id) if request_trivia_id else None),
                test_id=(Quizzes_Pointy.objects.get(id=request_test_id) if request_test_id else None),
            )
            
            return newLike
        else:
            userDidLikeForThisQuiz.delete()
            return request
        

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