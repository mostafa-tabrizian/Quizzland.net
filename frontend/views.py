import datetime
import json
import requests
from decouple import config

from .models import *
from .functions import *
from .serializers import *
from .filters import *

from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets, status
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken


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
            return Response(status=status.HTTP_400_BAD_REQUEST)

def index(request, *args, **kwargs):
    # FastFunctionForDB(request)
    return render(request, "frontend/index.html")

def auth_login(request, *args, **kwargs):
    print(request.method)
    
    if request.method == 'GET':
        access_token = AccessToken(request.GET.get('at'))
        
        try:
            user = CustomUser.objects.get(id=access_token['user_id'])
            
            return HttpResponse(
                json.dumps(
                    {
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'points': user.points,
                        'blocked': user.blocked,
                        'avatar': str(user.avatar),
                        'bio': user.bio,
                        'points': user.points,
                        'most_played_categories': user.most_played_categories,
                        'played_history': user.played_history,
                        'liked_quizzes': user.liked_quizzes,
                        'watch_list': user.watch_list,
                    }   
                )
            )
        except user.DoesNotExist:
            return HttpResponse('user does not exist!')
    
def checkAlreadyUserExists(username, email):
    return CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists() 

def verifyRecaptcha(response):
    RECAPTCHA_SECRET = config('RECAPTCHA_SECRET', cast=str)
    
    params = {
        'secret': RECAPTCHA_SECRET,
        'response': response
    }
    
    req = requests.post('https://www.google.com/recaptcha/api/siteverify', params)
    return (json.loads(req.content))['success']
    

def auth_register(request, *args, **kwargs):
    if request.method == 'POST':
        username = request.GET.get('u')
        email = request.GET.get('e')
        password = request.GET.get('p')
        reCaptcha_response = request.GET.get('rc')
        
        if not verifyRecaptcha(reCaptcha_response):
            print('not verified recaptcha or duplicate')
            return HttpResponse('not verified recaptcha or duplicate')
        
        elif checkAlreadyUserExists(username, email):
            print('user already exists')
            return HttpResponse('user already exists')
            
        else:
            try:
                newUser = CustomUser(
                    username=username,
                    email=email,
                )
                newUser.set_password(password)
                newUser.save()
                
                print('regitser')
                return HttpResponse('regitser')
            
            
            except Exception as e:
                print('exception--------------------------')
                print(e)

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
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    filterset_class = CustomUserFilter

# --------------------------------------------------------

class QuizView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Quizzes.objects.all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class PointyView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Quizzes_Pointy.objects.all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

# --------------------------------------------------------

class CommentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    filterset_class = CommentsFilter

# --------------------------------------------------------

class CategoriesView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class SubCategoryView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = SubCategories.objects.all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

# --------------------------------------------------------

class QuestionsView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class Questions_pointyView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Pointy_Questions.objects.all()
    serializer_class = questions_pointySerializer
    filterset_class = questions_pointyFilter  

# --------------------------------------------------------

class new_blogView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    filterset_class = BlogFilter

# --------------------------------------------------------

# class newsletter_usersView(viewsets.ModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter