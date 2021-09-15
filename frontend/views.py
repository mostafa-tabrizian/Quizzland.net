from django.shortcuts import render
from django.views.decorators.cache import never_cache
import datetime

from .models import *
from .functions import *
from rest_framework import viewsets
from .serializers import *
from .filters import *

from urllib.parse import unquote

def index(request):
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

def category(request, category):
    return render(request, "frontend/category.html")

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

def handler404(request, exception):
    return render(request, 'frontend/404.html', status=404)

class new_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes.objects.order_by('-publish').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class monthlyBest_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes.objects.order_by('-monthly_views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class best_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes.objects.order_by('-views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class alphabet_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes.objects.order_by('-subCategory').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

# --------------------------------------------------------

class new_pointy_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes_Pointy.objects.order_by('-publish').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class monthlyBest_pointy_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes_Pointy.objects.order_by('-monthly_views').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class best_pointy_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes_Pointy.objects.order_by('-views').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class alphabet_pointy_quiz(viewsets.ReadOnlyModelViewSet):
    queryset = Quizzes_Pointy.objects.order_by('-subCategory').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

# --------------------------------------------------------

class new_category(viewsets.ReadOnlyModelViewSet):
    queryset = SubCategories.objects.order_by('-publish').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class best_category(viewsets.ReadOnlyModelViewSet):
    queryset = SubCategories.objects.order_by('-views').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class alphabet_category(viewsets.ReadOnlyModelViewSet):
    queryset = SubCategories.objects.order_by('-subCategory').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

# --------------------------------------------------------

class questions(viewsets.ReadOnlyModelViewSet):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class pointyQuestions(viewsets.ReadOnlyModelViewSet):
    queryset = Pointy_Questions.objects.all()
    serializer_class = PointyQuestionsSerializer
    filterset_class = PointyQuestionsFilter  

# --------------------------------------------------------

class new_blog(viewsets.ReadOnlyModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    filterset_class = BlogFilter

# --------------------------------------------------------

# class newsletter_users(viewsets.ReadOnlyModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter