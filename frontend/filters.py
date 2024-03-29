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

class MessagesFilter(filters.FilterSet):
    class Meta:
        model = Messages
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
        
class QuizzesV2Filter(filters.FilterSet):
    class Meta:
        model= Quizzes_V2
        fields= {
            'public': ['exact'],
            'categoryKey': ['exact'],
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

class UserAnswerFilter(filters.FilterSet):
    class Meta:
        model = UserAnswer
        fields = {
            'user_id': ['exact'], 
            'question_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
        }
        
class UserScoreFilter(filters.FilterSet):
    class Meta:
        model = UserScore
        fields = {
            'user_id': ['exact'], 
            'quiz_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
            'score': ['lte', 'gte'],
        }

class LikeFilter(filters.FilterSet):
    class Meta:
        model = Like
        fields = {
            'user_id': ['exact'], 
            'quizV2_id': ['exact'],
            'test_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
        }

class CommentFilter(filters.FilterSet):
    class Meta:
        model = Comment
        fields = {
            'comment_text': ['icontains'],
            'quizV2_id': ['exact'],
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
            'quizV2_id': ['exact'],
            'test_id': ['exact'],
            'date_submitted': ['lte', 'gte'],
        }
        
class HistoryFilter(filters.FilterSet):
    class Meta:
        model = History
        fields = {
            'user_id': ['exact'], 
            'quizV2_id': ['exact'],
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
        
class QuestionsV2Filter(filters.FilterSet):
    class Meta:
        model = Questions_V2
        fields = {
            'quizKey': ['exact'],
            'date_submitted': ['lte', 'gte']
        }
        
class AnswerV2Filter(filters.FilterSet):
    class Meta:
        model = Answer_V2
        fields = {
            'questionKey': ['exact'],
        }

class QuestionsPointyFilter(filters.FilterSet):
    class Meta:
        model = Pointy_Questions
        fields = {
            'quizKey': ['exact']
        }
        
class ReportFilter(filters.FilterSet):
    class Meta:
        model = Report
        fields = {
            'user_id': ['exact'],
            'questionQuiz_id': ['exact'],
            'questionPointy_id': ['exact'],
            'title': ['icontains'],
            'date_submitted': ['lte', 'gte']
        }