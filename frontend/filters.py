from pyexpat import model
from django_filters import rest_framework as filters
from .models import *

class CustomUserFilter(filters.FilterSet):
    class Meta:
        model = CustomUser
        fields = {
            'username': ['exact'],
            'email': ['exact'],
            'is_active': ['exact']
        }

class NotificationFilter(filters.FilterSet):
    class Meta:
        model = Notification
        fields = {
            'user': ['exact'],
            'message': ['icontains'],
            'type': ['exact'],
            'has_read': ['exact'],
            'created_at': ['lte', 'gte'],
        }

class QuizzesFilter(filters.FilterSet):
    class Meta:
        model= Quizzes
        fields= {
            'public': ['exact'],
            'categoryKey': ['exact'],
            'subCategory': ['iexact'],
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
            'subCategory': ['iexact'],
            'slug': ['iexact', 'icontains'],
            'title': ['iexact', 'icontains'],
            'tags': ['iexact', 'icontains']
        }

class LikeFilter(filters.FilterSet):
    class Meta:
        model = Like
        fields = {
            'user_id': ['exact'], 
            'trivia_id': ['exact'],
            'test_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
        }

class CommentFilter(filters.FilterSet):
    class Meta:
        model = Comment
        fields = {
            'comment_text': ['icontains'],
            'trivia_id': ['exact'],
            'test_id': ['exact'], 
            'submitter_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
            'verified': ['exact']
        }

class WatchListFilter(filters.FilterSet):
    class Meta:
        model = Watch_List
        fields = {
            'user_id': ['exact'], 
            'trivia_id': ['exact'],
            'test_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
        }
        
class HistoryFilter(filters.FilterSet):
    class Meta:
        model = History
        fields = {
            'user_id': ['exact'], 
            'trivia_id': ['exact'],
            'test_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
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
            'subCategory': ['iexact'],
            'title': ['iexact', 'icontains']
        }

class QuestionsFilter(filters.FilterSet):
    class Meta:
        model = Questions
        fields = {
            'quizKey': ['exact'],
        }

class questionsPointyFilter(filters.FilterSet):
    class Meta:
        model = Pointy_Questions
        fields = {
            'quizKey': ['exact']
        }

# class BlogFilter(filters.FilterSet):
#     class Meta:
#         model = Blog
#         fields = {
#             'title': ['iexact', 'icontains']
#         }

# class NewsletterUserFilter(filters.FilterSet):
#     class Meta:
#         model = Newsletter_Users
#         fields = {
#             'email': ['iexact']
#         }
