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

        user_obj = CustomUser.objects.filter(email=attrs.get("username")).first(
        ) or CustomUser.objects.filter(username=attrs.get("username")).first()
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
            'q_coins',
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
                    raise serializers.ValidationError(
                        "username already exists")
                else:
                    instance.username = validated_data['username']
            else:
                raise serializers.ValidationError("username too short")
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']
        if 'last_name' in validated_data:
            instance.last_name = validated_data['last_name']
        if 'q_coins' in validated_data:
            instance.q_coins = validated_data['q_coins']
        if 'bio' in validated_data:
            instance.bio = validated_data['bio']
        if 'gender' in validated_data:
            instance.gender = validated_data['gender']
        if 'birthdayData' in validated_data:
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


class QuizzesV2Serializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    GIF_awful = serializers.ImageField(required=False)
    GIF_bad = serializers.ImageField(required=False)
    GIF_ok = serializers.ImageField(required=False)
    GIF_good = serializers.ImageField(required=False)
    GIF_great = serializers.ImageField(required=False)

    class Meta:
        model = Quizzes_V2
        fields = (
            '__all__'
        )

    categoryKey = CategoriesSerializer(many=False, read_only=True)


class PointyQuizzesSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    background = serializers.ImageField(required=False)
    result_img_1st = serializers.ImageField(required=False)
    result_img_2nd = serializers.ImageField(required=False)
    result_img_3rd = serializers.ImageField(required=False)
    result_img_4th = serializers.ImageField(required=False)
    result_img_5th = serializers.ImageField(required=False)
    result_img_6th = serializers.ImageField(required=False)
    result_img_7th = serializers.ImageField(required=False)
    result_img_8th = serializers.ImageField(required=False)
    result_img_9th = serializers.ImageField(required=False)
    result_img_10th = serializers.ImageField(required=False)

    class Meta:
        model = Quizzes_Pointy
        fields = (
            '__all__'
        )

    categoryKey = CategoriesSerializer(many=False, read_only=True)


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


class QuestionsV2Serializer(serializers.ModelSerializer):
    question_img = serializers.ImageField(required=False)
    option_img_1st = serializers.ImageField(required=False)
    option_img_2nd = serializers.ImageField(required=False)
    option_img_3rd = serializers.ImageField(required=False)
    option_img_4th = serializers.ImageField(required=False)
    
    class Meta:
        model = Questions_V2
        fields = (
            '__all__'
        )

    quizKey = QuizzesV2Serializer(many=False)
    submitter_id = CustomUserSerializer(many=False)
        
class AnswerV2Serializer(serializers.ModelSerializer):
    answer_imGif = serializers.ImageField(required=False)

    class Meta:
        model = Answer_V2
        fields = (
            '__all__'
        )

    questionKey = QuestionsV2Serializer(many=False)

class QuestionsPointySerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    background = serializers.ImageField(required=False)
    result_img_1st = serializers.ImageField(required=False)
    result_img_2nd = serializers.ImageField(required=False)
    result_img_3rd = serializers.ImageField(required=False)
    result_img_4th = serializers.ImageField(required=False)
    result_img_5th = serializers.ImageField(required=False)
    result_img_6th = serializers.ImageField(required=False)
    result_img_7th = serializers.ImageField(required=False)
    result_img_8th = serializers.ImageField(required=False)
    result_img_9th = serializers.ImageField(required=False)
    result_img_10th = serializers.ImageField(required=False)

    class Meta:
        model = Pointy_Questions
        fields = (
            '__all__'
        )

    quizKey = QuizzesSerializer(many=False)

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = (
            '__all__'
        )

    user_id = CustomUserSerializer(many=False)
    question_id = QuestionsV2Serializer(many=False, read_only=True)

    def create(self, request):
        request_user_id = self.context['request'].data['user_id']['username']
        request_question_id = self.context['request'].data['question_id']['id']
        request_user_answer = self.context['request'].data['user_answer']
        request_correct_answer = self.context['request'].data['correct_answer']

        newUserAnswer = UserAnswer.objects.create(
            user_id=(CustomUser.objects.get(id=request_user_id)),
            question_id=(Questions_V2.objects.get(id=request_question_id)),
            user_answer=request_user_answer,
            correct_answer=request_correct_answer
        )

        return newUserAnswer
    
class UserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserScore
        fields = (
            '__all__'
        )

    user_id = CustomUserSerializer(many=False)
    quiz_id = QuizzesV2Serializer(many=False)

    def create(self, request):
        request_user_id = self.context['request'].data['user_id']['username']
        request_quiz_id = self.context['request'].data['quiz_id']['id']
        request_score = self.context['request'].data['score']
        request_got_help = self.context['request'].data['got_help']

        newUserScore = UserScore.objects.create(
            user_id=(CustomUser.objects.get(id=request_user_id)),
            quiz_id=(Quizzes_V2.objects.get(id=request_quiz_id)),
            score=request_score,
            got_help=request_got_help
        )

        return newUserScore

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = (
            '__all__'
        )

    user_id = CustomUserSerializer(many=False)
    quizV2_id = QuizzesV2Serializer(many=False)
    test_id = PointyQuizzesSerializer(many=False)

    def create(self, request):
        request_user_id = self.context['request'].data['user_id']['username']
        request_quizV2_id = self.context['request'].data['quizV2_id']['id']
        request_test_id = self.context['request'].data['test_id']['id']

        userDidLikeForThisQuiz = Like.objects.filter(Q(user_id=request_user_id), Q(test_id=request_test_id) | Q(quizV2_id=request_quizV2_id))

        if (not userDidLikeForThisQuiz.exists()):
            newLike = Like.objects.create(
                user_id=(CustomUser.objects.get(id=(self.context['request'].data['user_id']['username']))),
                quizV2_id=(Quizzes_V2.objects.get(id=request_quizV2_id)if request_quizV2_id else None),
                test_id=(Quizzes_Pointy.objects.get(id=request_test_id) if request_test_id else None),
            )

            return newLike
        else:
            userDidLikeForThisQuiz.delete()
            return request
        
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
            quizV2_id=CommentData['quizV2_id'],
            test_id=CommentData['test_id'],
            verified=CommentData['verified'],
            submitter_id=CustomUser.objects.get(id=(self.context['request'].data['submitter_id']['username'])),
        )

        return newComment

class WatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watch_List
        fields = (
            '__all__'
        )

    user_id = CustomUserSerializer(many=False)
    quizV2_id = QuizzesV2Serializer(many=False)
    test_id = PointyQuizzesSerializer(many=False)

    def create(self, request):
        request_user_id = self.context['request'].data['user_id']['username']
        request_quizV2_id = self.context['request'].data['quizV2_id']['id']
        request_test_id = self.context['request'].data['test_id']['id']

        userWatchedForThisQuiz = Watch_List.objects.filter(Q(user_id=request_user_id), Q(test_id=request_test_id) | Q(quizV2_id=request_quizV2_id))

        if (not userWatchedForThisQuiz.exists()):
            newLike = Watch_List.objects.create(
                user_id=(CustomUser.objects.get(
                    id=(self.context['request'].data['user_id']['username']))),
                quizV2_id=(Quizzes_V2.objects.get(
                    id=request_quizV2_id) if request_quizV2_id else None),
                test_id=(Quizzes_Pointy.objects.get(
                    id=request_test_id) if request_test_id else None),
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
    quizV2_id = QuizzesV2Serializer(many=False, read_only=True)
    test_id = PointyQuizzesSerializer(many=False)

    def create(self, request):
        request_test_id = self.context['request'].data['test_id']['id']
        request_quizV2_id = self.context['request'].data['quizV2_id']['id']

        newLike = History.objects.create(
            user_id=(CustomUser.objects.get(
                id=(self.context['request'].data['user_id']['username']))),
            quizV2_id=(Quizzes_V2.objects.get(
                id=request_quizV2_id) if request_quizV2_id else None),
            test_id=(Quizzes_Pointy.objects.get(id=request_test_id)
                     if request_test_id else None),
        )

        return newLike
    
class ReprotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = (
            '__all__'
        )
        
    user_id = CustomUserSerializer(many=False)
    question_id = QuestionsV2Serializer(many=False)

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
