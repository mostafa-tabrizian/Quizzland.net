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
            'email',
            'username',
            'first_name',
            'last_name',
            'bio',
            'gender',
            'birthday_date',
            'avatar',
            'points',
            'is_active',
            'is_staff'
        )
        
    def update(self, instance, validated_data):
        def checkAlreadyUsernameExists(username):
            return CustomUser.objects.filter(username=username).exists()
        
        if 'username' in validated_data:
            username = validated_data['username']
            username_length = len(username)
            
            if username_length >= 3:
                if checkAlreadyUsernameExists(username):
                    raise serializers.ValidationError("username already exists")
                else:
                    instance.username = validated_data['username']
            else:
                raise serializers.ValidationError("username too short")
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']
        if 'last_name'in validated_data:
            instance.last_name = validated_data['last_name']
        if 'bio'in validated_data:
            instance.bio = validated_data['bio']
        if 'gender'in validated_data:
            instance.gender = validated_data['gender']
        if 'birthdayData'in validated_data:
            instance.birthday_date = validated_data['birthdayData']
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
            
        try:
            instance.save()
        except Exception as e:
            if 'Incorrect string value' in str(e):
                raise serializers.ValidationError('none valid emoji')
            else:
                raise serializers.ValidationError('error saving instance')
        
        return instance
    
class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
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
    thumbnail = serializers.ImageField(required=False)
    background = serializers.ImageField(required=False)
    GIF20 = serializers.ImageField(required=False)
    GIF40 = serializers.ImageField(required=False)
    GIF60 = serializers.ImageField(required=False)
    GIF80 = serializers.ImageField(required=False)
    GIF100 = serializers.ImageField(required=False)
    
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
        
class WatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watch_List
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
        
        userWatchedForThisQuiz = Watch_List.objects.filter(Q(user_id=request_user_id), Q(trivia_id=request_trivia_id) | Q(test_id=request_test_id))
        
        if (not userWatchedForThisQuiz.exists()):
            newLike = Watch_List.objects.create(
                user_id=(CustomUser.objects.get(id=(self.context['request'].data['user_id']['username']))),
                trivia_id=(Quizzes.objects.get(id=request_trivia_id) if request_trivia_id else None),
                test_id=(Quizzes_Pointy.objects.get(id=request_test_id) if request_test_id else None),
            )
            
            return newLike
        else:
            userWatchedForThisQuiz.delete()
            return request
        
class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = (
            '__all__'
        )
        
    user_id = CustomUserSerializer(many=False)
    trivia_id = QuizzesSerializer(many=False)
    test_id = PointyQuizzesSerializer(many=False)
    
    def create(self, request):
        request_trivia_id = self.context['request'].data['trivia_id']['id']
        request_test_id = self.context['request'].data['test_id']['id']
        
        newLike = History.objects.create(
            user_id=(CustomUser.objects.get(id=(self.context['request'].data['user_id']['username']))),
            trivia_id=(Quizzes.objects.get(id=request_trivia_id) if request_trivia_id else None),
            test_id=(Quizzes_Pointy.objects.get(id=request_test_id) if request_test_id else None),
        )
        
        return newLike

class QuestionsSerializer(serializers.ModelSerializer):
    question_img = serializers.ImageField(required=False)
    option_img_1st = serializers.ImageField(required=False)
    option_img_2nd = serializers.ImageField(required=False)
    option_img_3rd = serializers.ImageField(required=False)
    option_img_4th = serializers.ImageField(required=False)
    answer_imGif = serializers.ImageField(required=False)
    
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