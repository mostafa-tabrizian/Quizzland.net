from django.shortcuts import render
from .models import *
from .functions import *
from rest_framework import viewsets
from .serializers import *
from .filters import *

def index(request):
    return render(request, "frontend/index.html")

def quiz(request, title):
    return render(request, "frontend/quiz.html")

def category(request, category):
    return render(request, "frontend/category.html")

def subCategory(request, category, subCategory):
    return render(request, "frontend/subCategory.html")

def handler404(request, exception):
    return render(request, 'frontend/404.html', status=404)

class new_quiz(viewsets.ModelViewSet):
    queryset = Quizzes.objects.order_by('-publish').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class monthlyBest_quiz(viewsets.ModelViewSet):
    queryset = Quizzes.objects.order_by('-monthly_views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class best_quiz(viewsets.ModelViewSet):
    queryset = Quizzes.objects.order_by('-views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class alphabet_quiz(viewsets.ModelViewSet):
    queryset = Quizzes.objects.order_by('-subCategory').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class new_category(viewsets.ModelViewSet):
    queryset = SubCategories.objects.order_by('-publish').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class best_category(viewsets.ModelViewSet):
    queryset = SubCategories.objects.order_by('-views').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class alphabet_category(viewsets.ModelViewSet):
    queryset = SubCategories.objects.order_by('-subCategory').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class questions(viewsets.ModelViewSet):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class newsletter_users(viewsets.ModelViewSet):
    queryset = Newsletter_Users.objects.all()
    serializer_class = NewsletterUsersSerializer
    filterset_class = NewsletterUserFilter