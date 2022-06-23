from django.shortcuts import render
from django.views.decorators.cache import never_cache
import datetime
from urllib.parse import unquote
from django.contrib.auth import get_user_model

from .models import *
from .functions import *
from .serializers import *
from .filters import *

from rest_framework import viewsets, status
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

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

def setPassword(request, *args, **kwargs):
    username = request.GET.get('u')
    password = request.GET.get('p')
    
    # user = CustomUser.objects.get(username=username)
    # print(user)
    # return render(request, "frontend/index.html")

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

class CustomUser(viewsets.ModelViewSet):
    permissions_classes = (IsAuthenticated,)
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    filterset_class = CustomUserFilter

# --------------------------------------------------------

class Quiz(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Quizzes.objects.all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class Pointy(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Quizzes_Pointy.objects.all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

# --------------------------------------------------------

class Comment(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    filterset_class = CommentsFilter

# --------------------------------------------------------

class Categories(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class SubCategory(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = SubCategories.objects.all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

# --------------------------------------------------------

class Questions(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class Questions_pointy(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Pointy_Questions.objects.all()
    serializer_class = questions_pointySerializer
    filterset_class = questions_pointyFilter  

# --------------------------------------------------------

class new_blog(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    filterset_class = BlogFilter

# --------------------------------------------------------

# class newsletter_users(viewsets.ModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter