from django.http import HttpResponse
from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.hashers import make_password  # check_password
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist  # ValidationError
from django.core import serializers as core_serializers
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
import datetime, json, requests, random
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
      
@csrf_exempt
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
                        'points': user.points,
                        'avatar': str(user.avatar),
                        'bio': user.bio,
                        'points': user.points,
                        'likes': userLikesNumber,
                        'comments': userCommentsNumber,
                    }   
                )
            )
        except ObjectDoesNotExist:
            return HttpResponse('DoesNotExist')
        except Exception as e:
            return HttpResponse(e)
        
@csrf_exempt   
def search_user(request, *args, **kwargs):
    if request.method == 'POST':
        username = json.loads(request.body.decode('utf-8'))['username']
        
        try:
            user = CustomUser.objects.filter(Q(username__icontains=username) | Q(first_name__icontains=username) | Q(last_name__icontains=username) | Q(email__icontains=username))
            user = core_serializers.serialize('json', user, fields=(
                'id', 'avatar', 'first_name', 'last_name', 'username'
            ))
            
            return HttpResponse(user)
        
        except ObjectDoesNotExist:
            return HttpResponse('DoesNotExist')
        except Exception as e:
            return HttpResponse(e)
    
# def checkAlreadyUserExists(username, email):
#     return CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists() 

def verify_recaptcha(res):
    response = res.GET.get('r')
    RECAPTCHA_SECRET = config('RECAPTCHA_SECRET', cast=str)
    
    params = {
        'secret': RECAPTCHA_SECRET,
        'response': response
    }
    req = requests.post('https://www.google.com/recaptcha/api/siteverify', params)
    
    return HttpResponse((json.loads(req.content))['success'])
    
@csrf_exempt 
def auth_google(request, *args, **kwargs):
    payload = json.loads(request.body.decode('utf-8'))
    
    if request.method == 'POST':
        r = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', params={'access_token': payload['accessToken']})
        data = json.loads(r.text)

        if 'error' in data:
            content = {'message': 'wrong google token / this google token is already expired.'}
            return HttpResponse(content)

        def uniqueUsername():    
            # ugly function but im too tiered to do it
            try:
                selectUsername = f"{payload['username']}{random.randint(0, 9999)}"
                
                if CustomUser.objects.get(username=payload['username']):
                    return f"{selectUsername}_{payload['lastName']}"
                else:
                    return selectUsername
                
            except CustomUser.DoesNotExist:
                return payload['username']
        
        try:
            user = CustomUser.objects.get(email=data['email'])
            
            if user.is_active == False:
                return HttpResponse('inactive')
            
        except CustomUser.DoesNotExist:
            user = CustomUser()
            user.username = uniqueUsername()
            user.password = make_password(BaseUserManager().make_random_password())
            user.email = data['email']
            user.last_name = payload['lastName']
            user.first_name = payload['firstName']
            user.avatar = payload['avatar']
            user.save()
            
            welcome_message = Messages()
            welcome_message.user = user
            welcome_message.type = 'congrat'
            welcome_message.message = f"{payload['firstName']} جان به کوییزلند خوش اومدی"
            welcome_message.save()

        token = RefreshToken.for_user(user)  # generate token without username & password
        response = {}
        response['username'] = user.username
        response['access_token'] = str(token.access_token)
        response['refresh_token'] = str(token)
        
        return HttpResponse(json.dumps(response))
        
def restartEveryMonthlyViews(request):
    try:
        quizzes = Quizzes.objects.all()
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

        articles = Blog.objects.all()
        for article in articles:
            article.monthly_views = 0
            article.save()

        
    except Exception as e:
        print(f'{datetime.datetime.now()}:{e}')
        print('----------------------------------')
        return render(request, "frontend/404.html")

    return render(request, "frontend/index.html")

def FastFunctionForDB(request):
    quizzes = Quizzes.objects.all()
    
    for item in quizzes:
        try:
            print('------------------------')
            targetQuiz = Quizzes.objects.get(title=item.title)
            
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
            user = CustomUser.objects.filter(username=self.request.user.username)
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
    permission_classes = (BasePermission,)
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

class PointyView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
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
        
        if requestData['result_upTo_1st']: new_quiz.result_upTo_1st = requestData['result_upTo_1st']
        if requestData['result_upTo_2nd']: new_quiz.result_upTo_2nd = requestData['result_upTo_2nd']
        if requestData['result_upTo_3rd']: new_quiz.result_upTo_3rd = requestData['result_upTo_3rd']
        if requestData['result_upTo_4th']: new_quiz.result_upTo_4th = requestData['result_upTo_4th']
        if requestData['result_upTo_5th']: new_quiz.result_upTo_5th = requestData['result_upTo_5th']
        if requestData['result_upTo_6th']: new_quiz.result_upTo_6th = requestData['result_upTo_6th']
        if requestData['result_upTo_7th']: new_quiz.result_upTo_7th = requestData['result_upTo_7th']
        if requestData['result_upTo_8th']: new_quiz.result_upTo_8th = requestData['result_upTo_8th']
        if requestData['result_upTo_9th']: new_quiz.result_upTo_9th = requestData['result_upTo_9th']
        if requestData['result_upTo_10th']: new_quiz.result_upTo_10th = requestData['result_upTo_10th']
        
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
    permission_classes = (BasePermission,)
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

class QuestionsPointyView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
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

class LikeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = LikeSerializer
    filterset_class = LikeFilter
    
    def get_queryset(self):
        if self.request.user:
            like_objects = Like.objects.filter(user_id=self.request.user).order_by('date_submitted')
            
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
            watch_list_objects = Watch_List.objects.filter(user_id=self.request.user).order_by('date_submitted')
        
            if watch_list_objects.exists():
                return watch_list_objects
            else:
                return History.objects.none()
    
class HistoryView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = HistorySerializer
    filterset_class = HistoryFilter

    def get_queryset(self):
        if self.request.user:
            history_objects = History.objects.filter(user_id=self.request.user).order_by('date_submitted')
            
            if history_objects.exists():
                return history_objects
            else:
                return History.objects.none()
    
# --------------------------------------------------------

class CategoriesView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class SubCategoryView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = SubCategories.objects.all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

# --------------------------------------------------------

# class new_blogView(viewsets.ModelViewSet):
#     permission_classes = (IsAuthenticated,)
#     queryset = Blog.objects.all()
#     serializer_class = BlogSerializer
#     filterset_class = BlogFilter

# --------------------------------------------------------

# class newsletter_usersView(viewsets.ModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter