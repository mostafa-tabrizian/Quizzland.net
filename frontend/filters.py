from django_filters import rest_framework as filters
from .models import *

class QuizzesFilter(filters.FilterSet):
    class Meta:
        model= Quizzes
        fields= {
            'category': ['icontains'],
            'subCategory': ['icontains'],
            'title': ['iexact', 'icontains'],
            'tags': ['iexact', 'icontains']
        }

class CategoriesFilter(filters.FilterSet):
    class Meta:
        model= SubCategories
        fields= {
            'category': ['icontains'],
            'subCategory': ['icontains'],
            'title': ['iexact', 'icontains']
        }

class QuestionsFilter(filters.FilterSet):
    class Meta:
        model = Questions
        fields = {
            'title': ['iexact', 'icontains']
        }

class NewsletterUserFilter(filters.FilterSet):
    class Meta:
        model = Newsletter_Users
        fields = {
            'email': ['iexact']
        }
