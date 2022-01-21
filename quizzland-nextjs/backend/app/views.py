from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.contrib.auth.models import User

import datetime
from urllib.parse import unquote

from rest_framework import permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import *
from .functions import *
from .serializers import *
from .filters import *

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, req):
        try:
            data = req.data
            
            first_name = data['first_name']
            last_name = data['last_name']
            username = data['username']
            password = data['password']
            re_password = data['re_password']
            
            if password == re_password:
                if len(password) >= 8:
                    if not User.objects.filter(username=username).exists():
                        user = User.objects.create_user(
                            first_name=first_name,
                            last_name=last_name,
                            username=username,
                            password=password
                        )
                        
                        user.save()
                        
                        if  User.objects.filter(username=username).exists():
                            return Response(
                                {'success': 'Account created successfully'},
                                status=status.HTTP_201_CREATED
                            )
                        
                        else:
                            return Response(
                                {'error': "Something went wrong when trying to register account"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                        
                    else:
                        return Response(
                            {'error': 'Username already exists'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
            else:
                return Response(
                    {'error': "Password don't match"},
                    status = status.HTTP_400_BAD_REQUEST
                )
            
        except:
            return Response(
                {'error': 'Something went wrong when trying to register account'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoadUserView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            user = UserSerializer(user)
            
            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK
            )
            
        except:
            return Response(
                {'error': 'Something went wrong when trying to load user'},
                status=status.HTTP_400_BAD_REQUEST
            )

class QuizView_Newest(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes.objects.order_by('-publish').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class QuizView_MonthlyBest(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes.objects.order_by('-monthly_views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class QuizView_Best(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes.objects.order_by('-views').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class QuizView_Alphabet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes.objects.order_by('-subCategory').all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter
    
# -------------------------------------------------------------------------

class PointyView_Newest(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes_Pointy.objects.order_by('-publish').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class PointyView_MonthlyBest(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes_Pointy.objects.order_by('-monthly_views').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class PointyView_Best(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes_Pointy.objects.order_by('-views').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

class PointyView_Alphabet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Quizzes_Pointy.objects.order_by('-subCategory').all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

# -------------------------------------------------------------------------

class CategoryView_Newest(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = SubCategories.objects.order_by('-publish').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class CategoryView_Best(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = SubCategories.objects.order_by('-views').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class CategoryView_Alphabet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = SubCategories.objects.order_by('-subCategory').all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

# -------------------------------------------------------------------------

class QuestionView(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class PointyQuestionView(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Pointy_Questions.objects.all()
    serializer_class = questions_pointySerializer
    filterset_class = questions_pointyFilter  

# --------------------------------------------------------

class BlogView_Newest(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.BasePermission, )
    queryset = Blogs.objects.all().order_by('-publish').all()
    serializer_class = BlogSerializer
    filterset_class = BlogFilter

# def index(request):
#     return render(request, "frontend/index.html")

# @never_cache
# def quiz(request, title):
#     addViewToQuizzes(title)
#     return render(request, "frontend/quiz.html")

# def addViewToQuizzes(title):
#     titleWithOutHyphens = title.replace("-", " ")
#     finalTitle = unquote(titleWithOutHyphens)
    
#     shouldTryPointy = True
#     try:
#         quiz = Quizzes.objects.get(title=finalTitle)
#         quiz.views += 1
#         quiz.monthly_views += 1
#         quiz.save()
#         shouldTryPointy = False
#     except Exception as e:
#         # print(f'{datetime.datetime.now()}:{e}:{finalTitle} Not in Quizzes database')
#         # print('----------------------------------')
#         pass

#     if shouldTryPointy:
#         try:
#             quizPointy = Quizzes_Pointy.objects.get(title=finalTitle)
#             quizPointy.views += 1
#             quizPointy.monthly_views += 1
#             quizPointy.save()
#         except Exception as e:
#             pass

# def category(request, category):
#     return render(request, "frontend/category.html")

# @never_cache
# def subCategory(request, category, subCategory):
#     addViewToSubCategories(subCategory)
#     return render(request, "frontend/subCategory.html")

# def addViewToSubCategories(title):
#     titleWithOutHyphens = title.replace("-", " ")
#     finalTitle = unquote(titleWithOutHyphens)

#     try:
#         subCategory = SubCategories.objects.get(subCategory=finalTitle)
#         subCategory.views += 1
#         subCategory.monthly_views += 1
#         subCategory.save()
#     except:
#         pass

# def articles(request):
#     return render(request, "frontend/articles.html")

# def article(request, title):
#     addViewToArticle(title)
#     return render(request, "frontend/articles.html")

# def addViewToArticle(title):
#     titleWithOutHyphens = title.replace("+", " ")
#     finalTitle = unquote(titleWithOutHyphens)
    
#     try:
#         article = Articles.objects.get(title=finalTitle)
#         article.views += 1
#         article.monthly_views += 1
#         article.save()
#     except Exception as e:
#         # print(f'{datetime.datetime.now()}:{e}:{finalTitle} Not in Quizzes database')
#         # print('----------------------------------')
#         pass

# def restartEveryMonthlyViews(request):
#     try:
#         quizzes = Quizzes.objects.all()
#         for quiz in quizzes:
#             quiz.monthly_views = 0
#             quiz.save()

#         quizPointies = Quizzes_Pointy.objects.all()
#         for quizPointy in quizPointies:
#             quizPointy.monthly_views = 0
#             quizPointy.save()

#         subCategories = SubCategories.objects.all()
#         for subCategory in subCategories:
#             subCategory.monthly_views = 0
#             subCategory.save()

#         articles = Articles.objects.all()
#         for article in articles:
#             article.monthly_views = 0
#             article.save()

        
#     except Exception as e:
#         print(f'{datetime.datetime.now()}:{e}')
#         print('----------------------------------')
#         return render(request, "frontend/404.html")

#     return render(request, "frontend/index.html")

# def handler404(request, exception):
#     return render(request, 'frontend/404.html', status=404)

# def SOS(request, SOS):
#     return render(request, 'frontend/SOS.html')

# def SOS_landpage(request):
#     return render(request, 'frontend/SOS.html')

# --------------------------------------------------------

# class newsletter_users(viewsets.ReadOnlyModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter