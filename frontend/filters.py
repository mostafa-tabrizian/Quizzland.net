from pyexpat import model
from django_filters import rest_framework as filters
from .models import *

class CustomUserFilter(filters.FilterSet):
    class Meta:
        model = CustomUser
        fields = {
            'username': ['exact'],
        }

class QuizzesFilter(filters.FilterSet):
    class Meta:
        model= Quizzes
        fields= {
            'public': ['exact'],
            'categoryKey': ['exact'],
            'subCategory': ['icontains'],
            'slug': ['iexact', 'icontains'],
            'title': ['iexact', 'icontains'],
            'tags': ['iexact', 'icontains']
        }

class PointyQuizzesFilter(filters.FilterSet):
    class Meta:
        model= Quizzes_Pointy
        fields= {
            'public': ['exact'],
            'categoryKey': ['exact'],
            'subCategory': ['icontains'],
            'slug': ['iexact', 'icontains'],
            'title': ['iexact', 'icontains'],
            'tags': ['iexact', 'icontains']
        }

class CommentsFilter(filters.FilterSet):
    class Meta:
        model = Comments
        fields = {
            'comment_text': ['icontains'],
            'quiz_related': ['exact'],
            'test_related': ['exact'], 
            'submitter_related': ['exact'],
            'date_submitted': ['lte', 'gte'],
            'verified': ['exact']
        }

class CategoriesFilter(filters.FilterSet):
    class Meta:
        model= Categories
        fields= {
            'title_english': ['icontains'],
            'title_persian': ['icontains'],
        }

class SubCategoriesFilter(filters.FilterSet):
    class Meta:
        model= SubCategories
        fields= {
            'public': ['exact'],
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
