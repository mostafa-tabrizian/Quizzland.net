from django.shortcuts import render
from django.views.decorators.cache import never_cache
import datetime
from urllib.parse import unquote

from .models import *
from .functions import *
from .serializers import *
from .filters import *

from rest_framework import viewsets, status
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
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
    return render(request, "frontend/index.html")

@never_cache
def quiz(request, title):
    addViewToQuizzes(title)
    return render(request, "frontend/quiz.html")

def addViewToQuizzes(title):
    titleWithOutHyphens = title.replace("-", " ")
    finalTitle = unquote(titleWithOutHyphens)
    
    shouldTryPointy = True
    try:
        quiz = Quizzes.objects.get(title=finalTitle)
        quiz.views += 1
        quiz.monthly_views += 1
        quiz.save()
        shouldTryPointy = False
    except Exception as e:
        # print(f'{datetime.datetime.now()}:{e}:{finalTitle} Not in Quizzes database')
        # print('----------------------------------')
        pass

    if shouldTryPointy:
        try:
            quizPointy = Quizzes_Pointy.objects.get(title=finalTitle)
            quizPointy.views += 1
            quizPointy.monthly_views += 1
            quizPointy.save()
        except Exception as e:
            pass

@never_cache
def subCategory(request, category, subCategory):
    addViewToSubCategories(subCategory)
    return render(request, "frontend/subCategory.html")

def addViewToSubCategories(title):
    titleWithOutHyphens = title.replace("-", " ")
    finalTitle = unquote(titleWithOutHyphens)

    try:
        subCategory = SubCategories.objects.get(subCategory=finalTitle)
        subCategory.views += 1
        subCategory.monthly_views += 1
        subCategory.save()
    except:
        pass

def blog(request):
    return render(request, "frontend/blog.html")

def article(request, title):
    addViewToArticle(title)
    return render(request, "frontend/blog.html")

def addViewToArticle(title):
    titleWithOutHyphens = title.replace("+", " ")
    finalTitle = unquote(titleWithOutHyphens)
    
    try:
        article = Blog.objects.get(title=finalTitle)
        article.views += 1
        article.monthly_views += 1
        article.save()
    except Exception as e:
        # print(f'{datetime.datetime.now()}:{e}:{finalTitle} Not in Quizzes database')
        # print('----------------------------------')
        pass

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

# def renameQuestions(request):
#     questions = Pointy_Questions.objects.all()
    
#     for question in questions:
#         try:
#             print('------------------------')
#             qtitle = Quizzes_Pointy.objects.get(title=question.title)
            
#             question.quizKey_id = qtitle.id
#             question.save()
            
#             print(question.quizKey)  
#         except Exception as e:
#             print(question.title)
    
#     return render(request, "frontend/index.html")
        

def handler404(request, exception):
    return render(request, 'frontend/404.html', status=404)

def SOS(request, SOS):
    return render(request, 'frontend/SOS.html')

def SOS_landpage(request):
    return render(request, 'frontend/SOS.html')

class Categories(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class quiz_new(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes.objects.order_by('-publish').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class quiz_monthly(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes.objects.order_by('-monthly_views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class quiz_best(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes.objects.order_by('-views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class quiz_alphabet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes.objects.order_by('-subCategory').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

# --------------------------------------------------------

class pointy_new(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes_Pointy.objects.order_by('-publish').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class pointy_monthly(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes_Pointy.objects.order_by('-monthly_views').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class best_pointy_quiz(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes_Pointy.objects.order_by('-views').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class pointy_alphabet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Quizzes_Pointy.objects.order_by('-subCategory').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

# --------------------------------------------------------

class SubCategory_new(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = SubCategories.objects.order_by('-publish').all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

class SubCategory_best(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = SubCategories.objects.order_by('-views').all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

class SubCategory_alphabet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = SubCategories.objects.order_by('-subCategory').all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

# --------------------------------------------------------

class questions(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class questions_pointy(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Pointy_Questions.objects.all()
    serializer_class = questions_pointySerializer
    filterset_class = questions_pointyFilter  

# --------------------------------------------------------

class new_blog(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    filterset_class = BlogFilter

# --------------------------------------------------------

# class newsletter_users(viewsets.ModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter