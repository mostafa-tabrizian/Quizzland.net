from django_filters import rest_framework as filters
from .models import *

class QuizzesFilter(filters.FilterSet):
    class Meta:
        model= Quizzes
        fields= {
            'categoryKey': ['exact'],
            'subCategory': ['icontains'],
            'title': ['iexact', 'icontains'],
            'tags': ['iexact', 'icontains']
        }

class PointyQuizzesFilter(filters.FilterSet):
    class Meta:
        model= Quizzes_Pointy
        fields= {
            'categoryKey': ['exact'],
            'subCategory': ['icontains'],
            'title': ['iexact', 'icontains'],
            'tags': ['iexact', 'icontains']
        }

class CategoriesFilter(filters.FilterSet):
    class Meta:
        model= SubCategories
        fields= {
            'categoryKey': ['exact'],
            'subCategory': ['icontains'],
            'title': ['iexact', 'icontains']
        }

class QuestionsFilter(filters.FilterSet):
    class Meta:
        model = Questions
        fields = {
            'quizKey': ['exact'],
        }

class questions_pointyFilter(filters.FilterSet):
    class Meta:
        model = Pointy_Questions
        fields = {
            'quizKey': ['exact']
        }

class BlogFilter(filters.FilterSet):
    class Meta:
        model = Blog
        fields = {
            'title': ['iexact', 'icontains']
        }

# class NewsletterUserFilter(filters.FilterSet):
#     class Meta:
#         model = Newsletter_Users
#         fields = {
#             'email': ['iexact']
#         }
