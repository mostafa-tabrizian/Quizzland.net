from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.hashers import make_password  # check_password
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist  # ValidationError
from django.core import serializers as core_serializers
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
import datetime
from rest_framework.decorators import api_view
import json
import requests
import random
from decouple import config

from .models import *
from .serializers import *
from .filters import *


class ObtainTokenPairWithColorView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            if str(e) != 'Token is blacklisted':
                return Response(status=status.HTTP_400_BAD_REQUEST)


def index(request, *args, **kwargs):
    # FastFunctionForDB(request)
    return render(request, "frontend/index.html")

def public_profile(request, *args, **kwargs):
    if request.method == 'POST':
        username = json.loads(request.body.decode('utf-8'))['username']

        try:
            user = CustomUser.objects.get(username=username)
            userLikesNumber = len(Like.objects.filter(user_id=user))
            userCommentsNumber = len(Comment.objects.filter(submitter_id=user))

            return HttpResponse(
                json.dumps(
                    {
                        'id': user.id,
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'q_coins': user.q_coins,
                        'avatar': str(user.avatar),
                        'bio': user.bio,
                        'likes': userLikesNumber,
                        'comments': userCommentsNumber,
                    }
                )
            )
        except ObjectDoesNotExist:
            return HttpResponse('DoesNotExist')
        except Exception as e:
            return HttpResponse(e)

# def search_user(request, *args, **kwargs):
#     if request.method == 'POST':
#         username = json.loads(request.body.decode('utf-8'))['username']

#         try:
#             user = CustomUser.objects.filter(Q(username__icontains=username) | Q(
#                 first_name__icontains=username) | Q(last_name__icontains=username) | Q(email__icontains=username))
#             user = core_serializers.serialize('json', user, fields=(
#                 'id', 'avatar', 'first_name', 'last_name', 'username'
#             ))

#             return HttpResponse(user)

#         except ObjectDoesNotExist:
#             return HttpResponse('DoesNotExist')
#         except Exception as e:
#             return HttpResponse(e)

# def checkAlreadyUserExists(username, email):
#     return CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists()

def answer(request, *args, **kwargs):
    if request.method == 'GET':
        questionId = request.GET.get('questionId')
        answer = Answer_V2.objects.get(questionKey=questionId)
        
        return JsonResponse({
            'answer': answer.answer,
            'answer_text': answer.answer_text,
            'answer_imGif': answer.answer_imGif.url
        })
        
def answers_poll(request, *args, **kwargs):
    if request.method == 'GET':
        questionId = request.GET.get('questionId')
        answers = UserAnswer.objects.filter(question_id=questionId)
        
        option1 = 0; option2 = 0; option3 = 0; option4 = 0
        
        
        for answer in answers:
            if answer.user_answer == 1:
                option1 += 1
            elif answer.user_answer == 2:
                option2 += 1
            elif answer.user_answer == 3:
                option3 += 1
            elif answer.user_answer == 4:
                option4 += 1
                        
        return JsonResponse({
            'total': option1 + option2 + option3 + option4,
            'option1': option1,
            'option2': option2,
            'option3': option3,
            'option4': option4,
        })
        
@api_view(['POST'])
def send_report(request):
    if request.method == 'POST' and request.user:
        payload = json.loads(request.body.decode('utf-8'))
        question_id = payload['question_id']
        title = payload['title']
        description = payload['description']
        type = payload['type']

        try:
            questionQuiz = None
            questionTest = None
            
            if type == 'quiz':
                questionQuiz = Questions_V2.objects.filter(id=question_id)
            elif type == 'test':
                questionTest = Pointy_Questions.objects.filter(id=question_id)
                
            new_report = Report()
            new_report.user_id = request.user
            new_report.questionQuiz_id = questionQuiz and questionQuiz[0]
            new_report.questionPointy_id = questionTest and questionTest[0]
            new_report.title = title
            new_report.description = description
            new_report.save()

            return HttpResponse(f'report saved id: {new_report.id} title: {new_report.title}')
        except Exception as e:
            return HttpResponse(e)
        
@api_view(['GET'])
def daily_reward(request):
    def give_reward():
        random_reward = random.randrange(50, 1000, 20)
        user = CustomUser.objects.get(id=request.user.id)
        user.q_coins += random_reward  # change in userProfileDetail for frontend in header
        user.save()
        
        first_daily_reward = DailyReward()
        first_daily_reward.user_id = request.user
        first_daily_reward.save()
        
        return random_reward
        
    if request.method == 'GET' and request.user:
        user_daily_reward = DailyReward.objects.filter(user_id=request.user).order_by('date')
        
        if user_daily_reward:
            previous_reward_date = user_daily_reward.reverse()[0].date
            current_date = datetime.datetime.now().date()
            
            if current_date != previous_reward_date:
                reward = give_reward()
                return HttpResponse(reward)
            else:
                return HttpResponse(False)
        else:
            reward = give_reward()
            return HttpResponse(reward)

def verify_recaptcha(res):
    response = res.GET.get('r')
    RECAPTCHA_SECRET = config('RECAPTCHA_SECRET', cast=str)

    params = {
        'secret': RECAPTCHA_SECRET,
        'response': response
    }
    req = requests.post(
        'https://www.google.com/recaptcha/api/siteverify', params)

    return HttpResponse((json.loads(req.content))['success'])

def auth_google(request, *args, **kwargs):
    payload = json.loads(request.body.decode('utf-8'))

    if request.method == 'POST':
        try:
            user = CustomUser.objects.get(email=payload['email'])

            if user.is_active == False:
                return HttpResponse('inactive')

        except CustomUser.DoesNotExist:
            def uniqueUsername():
                try:
                    check = CustomUser.objects.get(username=payload['username'])
                    return payload['email']
                except CustomUser.DoesNotExist:
                    return payload['username']
            
            user = CustomUser()
            user.username = uniqueUsername()
            user.password = make_password(BaseUserManager().make_random_password())
            user.email = payload['email']
            user.last_name = payload['lastName']
            user.first_name = payload['firstName']
            user.avatar = payload['avatar']
            user.save()

            welcome_message = Messages()
            welcome_message.user = user
            welcome_message.type = 'congrat'
            welcome_message.message = f"{payload['firstName']} به کوییزلند خوش اومدی"
            # f"{payload['firstName']} جان به کوییزلند خوش اومدی"
            welcome_message.save()

        # generate token without username & password
        token = RefreshToken.for_user(user)
        response = {}
        response['username'] = user.username
        response['access_token'] = str(token.access_token)
        response['refresh_token'] = str(token)

        return HttpResponse(json.dumps(response))

def restartEveryMonthlyViews(request):
    try:
        quizzes = Quizzes_V2.objects.all()
        for quiz in quizzes:
            quiz.monthly_views = 0
            quiz.save()

        quizPointies = Quizzes_Pointy.objects.all()
        for quizPointy in quizPointies:
            quizPointy.monthly_views = 0
            quizPointy.save()

        categories = SubCategories.objects.all()
        for category in categories:
            category.monthly_views = 0
            category.save()

        subCategories = SubCategories.objects.all()
        for subCategory in subCategories:
            subCategory.monthly_views = 0
            subCategory.save()

    except Exception as e:
        print(f'{datetime.datetime.now()}:{e}')
        print('----------------------------------')
        return render(request, "frontend/404.html")

    return render(request, "frontend/index.html")

def calcView(request, *args, **kwargs):
    if request.method == 'GET':
        date_range = request.GET.get('dateRange')
    
        if date_range == 'monthly':
            month_ago = datetime.datetime.fromtimestamp(datetime.datetime.timestamp(datetime.datetime.now()) - 2_592_000.0)
            histories = History.objects.filter(date_submitted__gte=month_ago)  # 30days ago
        else:
            histories = History.objects.all()
        
        data = {}
        
        for history in histories:
            if history.quizV2_id:
                history = history.quizV2_id.slug
            elif history.test_id:
                history = history.test_id.slug
                
            if history in data:
                data[history] += 1
            else:
                data[history] = 1

        return HttpResponse(json.dumps(data))

def FastFunctionForDB(request):
    quizzes = Quizzes_V2.objects.all()

    for item in quizzes:
        try:
            print('------------------------')
            targetQuiz = Quizzes_V2.objects.get(title=item.title)

            item.question_background = '#911a1a'
            item.save()

            print(item.title)
        except Exception as e:
            raise Exception(f'Error: {item.title} : {e}')


def handler404(request, exception):
    return render(request, 'frontend/404.html', status=404)


class CustomUserView(viewsets.ModelViewSet):
    permissions_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer
    filterset_class = CustomUserFilter

    def get_queryset(self):
        if self.request.user and self.request.method == 'GET':
            user = CustomUser.objects.filter(
                username=self.request.user.username)
            return user


class MessagesView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = MessagesSerializer
    filterset_class = MessagesFilter

    def get_queryset(self):
        if self.request.user and self.request.method == 'GET':
            Messages_objects = Messages.objects.filter(user=self.request.user)

            print(Messages_objects)

            if Messages_objects.exists():
                return Messages_objects.order_by('-created_at')
            else:
                return Messages.objects.none()

# --------------------------------------------------------


class QuizView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes.objects.all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

    def create(self, request):
        requestData = request.data
        category = Categories.objects.get(id=requestData['categoryKey'])

        public = None
        if requestData['public'] == 'true':
            public = True
        elif requestData['public'] == 'false':
            public = False

        new_quiz = Quizzes()

        new_quiz.public = public
        new_quiz.categoryKey = category
        new_quiz.subCategory = requestData['subCategory']
        new_quiz.slug = requestData['slug']
        new_quiz.title = requestData['title']
        new_quiz.tags = requestData['tags']
        new_quiz.fan_name = requestData['fan_name']
        new_quiz.question_background = requestData['question_background']
        new_quiz.thumbnail = requestData['thumbnail']
        new_quiz.background = requestData['background']
        new_quiz.GIF20 = requestData['GIF20']
        new_quiz.GIF40 = requestData['GIF40']
        new_quiz.GIF60 = requestData['GIF60']
        new_quiz.GIF80 = requestData['GIF80']
        new_quiz.GIF100 = requestData['GIF100']
        new_quiz.created_by = request.user

        new_quiz.save()

        return HttpResponse('quiz created successfully')


class QuizV2View(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes_V2.objects.all()
    serializer_class = QuizzesV2Serializer
    filterset_class = QuizzesV2Filter

    def create(self, request):
        requestData = request.data
        category = Categories.objects.get(id=requestData['categoryKey'])

        public = None
        if requestData['public'] == 'true':
            public = True
        elif requestData['public'] == 'false':
            public = False

        new_quiz = Quizzes_V2()

        new_quiz.public = public
        new_quiz.categoryKey = category
        new_quiz.slug = requestData['slug']
        new_quiz.title = requestData['title']
        new_quiz.fees = requestData['fees']
        new_quiz.tags = requestData['tags']
        new_quiz.theme = requestData['theme']
        new_quiz.thumbnail = requestData['thumbnail']
        new_quiz.GIF_awful = requestData['GIF_awful']
        new_quiz.GIF_bad = requestData['GIF_bad']
        new_quiz.GIF_ok = requestData['GIF_ok']
        new_quiz.GIF_good = requestData['GIF_good']
        new_quiz.GIF_great = requestData['GIF_great']
        new_quiz.created_by = request.user

        new_quiz.save()

        return HttpResponse('quiz created successfully')


class PointyView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes_Pointy.objects.all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

    def create(self, request):
        requestData = request.data
        category = Categories.objects.get(id=requestData['categoryKey'])

        public = None
        if requestData['public'] == 'true':
            public = True
        elif requestData['public'] == 'false':
            public = False

        new_quiz = Quizzes_Pointy()

        new_quiz.public = public
        new_quiz.categoryKey = category
        new_quiz.subCategory = requestData['subCategory']
        new_quiz.slug = requestData['slug']
        new_quiz.title = requestData['title']
        new_quiz.tags = requestData['tags']

        new_quiz.question_background = requestData['question_background']
        new_quiz.thumbnail = requestData['thumbnail']
        new_quiz.background = requestData['background']

        if requestData['result_upTo_1st']:
            new_quiz.result_upTo_1st = requestData['result_upTo_1st']
        if requestData['result_upTo_2nd']:
            new_quiz.result_upTo_2nd = requestData['result_upTo_2nd']
        if requestData['result_upTo_3rd']:
            new_quiz.result_upTo_3rd = requestData['result_upTo_3rd']
        if requestData['result_upTo_4th']:
            new_quiz.result_upTo_4th = requestData['result_upTo_4th']
        if requestData['result_upTo_5th']:
            new_quiz.result_upTo_5th = requestData['result_upTo_5th']
        if requestData['result_upTo_6th']:
            new_quiz.result_upTo_6th = requestData['result_upTo_6th']
        if requestData['result_upTo_7th']:
            new_quiz.result_upTo_7th = requestData['result_upTo_7th']
        if requestData['result_upTo_8th']:
            new_quiz.result_upTo_8th = requestData['result_upTo_8th']
        if requestData['result_upTo_9th']:
            new_quiz.result_upTo_9th = requestData['result_upTo_9th']
        if requestData['result_upTo_10th']:
            new_quiz.result_upTo_10th = requestData['result_upTo_10th']

        new_quiz.result_title_1st = requestData['result_title_1st']
        new_quiz.result_title_2nd = requestData['result_title_2nd']
        new_quiz.result_title_3rd = requestData['result_title_3rd']
        new_quiz.result_title_4th = requestData['result_title_4th']
        new_quiz.result_title_5th = requestData['result_title_5th']
        new_quiz.result_title_6th = requestData['result_title_6th']
        new_quiz.result_title_7th = requestData['result_title_7th']
        new_quiz.result_title_8th = requestData['result_title_8th']
        new_quiz.result_title_9th = requestData['result_title_9th']
        new_quiz.result_title_10th = requestData['result_title_10th']

        new_quiz.result_text_1st = requestData['result_text_1st']
        new_quiz.result_text_2nd = requestData['result_text_2nd']
        new_quiz.result_text_3rd = requestData['result_text_3rd']
        new_quiz.result_text_4th = requestData['result_text_4th']
        new_quiz.result_text_5th = requestData['result_text_5th']
        new_quiz.result_text_6th = requestData['result_text_6th']
        new_quiz.result_text_7th = requestData['result_text_7th']
        new_quiz.result_text_8th = requestData['result_text_8th']
        new_quiz.result_text_9th = requestData['result_text_9th']
        new_quiz.result_text_10th = requestData['result_text_10th']

        new_quiz.result_img_1st = requestData['result_img_1st']
        new_quiz.result_img_2nd = requestData['result_img_2nd']
        new_quiz.result_img_3rd = requestData['result_img_3rd']
        new_quiz.result_img_4th = requestData['result_img_4th']
        new_quiz.result_img_5th = requestData['result_img_5th']
        new_quiz.result_img_6th = requestData['result_img_6th']
        new_quiz.result_img_7th = requestData['result_img_7th']
        new_quiz.result_img_8th = requestData['result_img_8th']
        new_quiz.result_img_9th = requestData['result_img_9th']
        new_quiz.result_img_10th = requestData['result_img_10th']

        new_quiz.created_by = request.user

        new_quiz.save()

        return HttpResponse('quiz created successfully')

# --------------------------------------------------------


class QuestionsView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter

    def create(self, request):
        requestData = request.data
        quizKey = Quizzes.objects.get(id=requestData['quizKey'])

        new_question = Questions()

        new_question.quizKey = quizKey
        new_question.question = requestData['question']
        new_question.question_img = requestData['question_img']

        new_question.option_1st = requestData['option_1st']
        new_question.option_2nd = requestData['option_2nd']
        new_question.option_3rd = requestData['option_3rd']
        new_question.option_4th = requestData['option_4th']

        new_question.option_img_1st = requestData['option_img_1st']
        new_question.option_img_2nd = requestData['option_img_2nd']
        new_question.option_img_3rd = requestData['option_img_3rd']
        new_question.option_img_4th = requestData['option_img_4th']

        new_question.answer = requestData['answer']
        new_question.answer_imGif = requestData['answer_imGif']
        new_question.answer_text = requestData['answer_text']

        new_question.save()

        return HttpResponse('question created successfully')


class QuestionsV2View(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Questions_V2.objects.all()
    serializer_class = QuestionsV2Serializer
    filterset_class = QuestionsV2Filter

    def create(self, request):
        requestData = request.data
        quizKey = Quizzes_V2.objects.get(id=requestData['quizKey'])
        submitter_id = CustomUser.objects.get(id=requestData['submitter_id'])
        
        new_question = Questions_V2()

        new_question.quizKey = quizKey
        new_question.submitter_id = submitter_id
        new_question.question = requestData['question']
        new_question.question_img = requestData['question_img']

        new_question.option_1st = requestData['option_1st']
        new_question.option_2nd = requestData['option_2nd']
        new_question.option_3rd = requestData['option_3rd']
        new_question.option_4th = requestData['option_4th']

        new_question.option_img_1st = requestData['option_img_1st']
        new_question.option_img_2nd = requestData['option_img_2nd']
        new_question.option_img_3rd = requestData['option_img_3rd']
        new_question.option_img_4th = requestData['option_img_4th']

        new_question.save()
        
        return HttpResponse(new_question.id)

    
class AnswerV2View(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # queryset = Answer_V2.objects.all()
    serializer_class = AnswerV2Serializer
    filterset_class = AnswerV2Filter
    
    def get_queryset(self):
        return

    def create(self, request):
        requestData = request.data
        questionKey = Questions_V2.objects.get(id=requestData['questionKey'])

        relate_answer = Answer_V2()

        relate_answer.questionKey = questionKey

        relate_answer.answer = requestData['answer']
        relate_answer.answer_imGif = requestData['answer_imGif']
        relate_answer.answer_text = requestData['answer_text']

        relate_answer.save()

        return HttpResponse('answer added successfully')

class QuestionsPointyView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Pointy_Questions.objects.all()
    serializer_class = QuestionsPointySerializer
    filterset_class = QuestionsPointyFilter

    def create(self, request):
        requestData = request.data
        quizKey = Quizzes_Pointy.objects.get(id=requestData['quizKey'])

        new_question = Pointy_Questions()

        new_question.quizKey = quizKey
        new_question.question = requestData['question']
        new_question.question_img = requestData['question_img']

        new_question.option_1st = requestData['option_1st']
        new_question.option_2nd = requestData['option_2nd']
        new_question.option_3rd = requestData['option_3rd']
        new_question.option_4th = requestData['option_4th']
        new_question.option_5th = requestData['option_5th']
        new_question.option_6th = requestData['option_6th']
        new_question.option_7th = requestData['option_7th']
        new_question.option_8th = requestData['option_8th']
        new_question.option_9th = requestData['option_9th']
        new_question.option_10th = requestData['option_10th']

        new_question.option_img_1st = requestData['option_img_1st']
        new_question.option_img_2nd = requestData['option_img_2nd']
        new_question.option_img_3rd = requestData['option_img_3rd']
        new_question.option_img_4th = requestData['option_img_4th']
        new_question.option_img_5th = requestData['option_img_5th']
        new_question.option_img_6th = requestData['option_img_6th']
        new_question.option_img_7th = requestData['option_img_7th']
        new_question.option_img_8th = requestData['option_img_8th']
        new_question.option_img_9th = requestData['option_img_9th']
        new_question.option_img_10th = requestData['option_img_10th']

        new_question.option_point_1st = requestData['option_point_1st']
        new_question.option_point_2nd = requestData['option_point_2nd']
        new_question.option_point_3rd = requestData['option_point_3rd']
        new_question.option_point_4th = requestData['option_point_4th']
        new_question.option_point_5th = requestData['option_point_5th']
        new_question.option_point_6th = requestData['option_point_6th']
        new_question.option_point_7th = requestData['option_point_7th']
        new_question.option_point_8th = requestData['option_point_8th']
        new_question.option_point_9th = requestData['option_point_9th']
        new_question.option_point_10th = requestData['option_point_10th']

        new_question.save()

        return HttpResponse('question created successfully')

# --------------------------------------------------------

class UserAnswerView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserAnswerSerializer
    filterset_class = UserAnswerFilter

    def get_queryset(self):
        if self.request.user:
            UserAnswer_objects = UserAnswer.objects.filter(
                user_id=self.request.user).order_by('date_submitted')

            if UserAnswer_objects.exists():
                return UserAnswer_objects
            else:
                return History.objects.none()

class UserScoreView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    serializer_class = UserScoreSerializer
    filterset_class = UserScoreFilter

    def get_queryset(self):
        if self.request.user:
            UserScore_objects = UserScore.objects.filter(
                user_id=self.request.user).order_by('date_submitted')

            if UserScore_objects.exists():
                return UserScore_objects
            else:
                return History.objects.none()
            
    def create(self, request):
        requestData = request.data
        new_score = UserScore()
        
        if self.request.user.is_anonymous:
            new_score.user_id = None
        else:
            new_score.user_id = self.request.user
            
        quiz_id = Quizzes_V2.objects.get(id=requestData['quiz_id'])
        score = requestData['score']
        got_help = requestData['got_help']
        
        new_score.quiz_id = quiz_id
        new_score.score = score
        new_score.got_help = got_help
            
        new_score.save()
        
        return HttpResponse(new_score)

class LikeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = LikeSerializer
    filterset_class = LikeFilter

    def get_queryset(self):
        if self.request.user:
            like_objects = Like.objects.filter(
                user_id=self.request.user).order_by('date_submitted')

            if like_objects.exists():
                return like_objects
            else:
                return History.objects.none()


class CommentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filterset_class = CommentFilter

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


class WatchListView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = WatchListSerializer
    filterset_class = WatchListFilter

    def get_queryset(self):
        if self.request.user:
            watch_list_objects = Watch_List.objects.filter(
                user_id=self.request.user).order_by('date_submitted')

            if watch_list_objects.exists():
                return watch_list_objects
            else:
                return History.objects.none()


class HistoryView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    serializer_class = HistorySerializer
    filterset_class = HistoryFilter

    def get_queryset(self):
        if self.request.user:
            history_objects = History.objects.filter(
                user_id=self.request.user).order_by('date_submitted')

            if history_objects.exists():
                return history_objects
            else:
                return History.objects.none()
            
    def create(self, request):
        requestData = request.data
        new_history = History()
        
        if self.request.user.is_anonymous:
            new_history.user_id = None
        else:
            new_history.user_id = self.request.user
            
        quizV2_id = requestData['quizV2_id']
        test_id = requestData['test_id']
            
        if quizV2_id:
            new_history.quizV2_id = Quizzes_V2.objects.get(id=quizV2_id)
        if test_id:
            new_history.test_id = Quizzes_Pointy.objects.get(id=test_id)
            
        new_history.save()
        
        return HttpResponse(new_history)

# --------------------------------------------------------


class CategoriesView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter


class SubCategoryView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = SubCategories.objects.all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter