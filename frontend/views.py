import datetime, json, requests, random
from decouple import config

from .models import *
from .serializers import *
from .filters import *

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password  # check_password
from django.core.exceptions import ObjectDoesNotExist  # ValidationError
from rest_framework import viewsets, status
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken

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
            if str(e) != 'Token is blacklisted':
                return Response(status=status.HTTP_400_BAD_REQUEST)
        
def index(request, *args, **kwargs):
    # FastFunctionForDB(request)
    return render(request, "frontend/index.html")
        
def public_profile(request, *args, **kwargs):
    if request.method == 'POST':
        username = json.loads(request.body.decode('utf-8'))['username']
        
        try:
            user = CustomUser.objects.get(username=username)
            userLikesNumber = len(Like.objects.filter(user_id=user))
            userCommentsNumber = len(Comment.objects.filter(submitter_id=user))
            
            return HttpResponse(
                json.dumps(
                    {
                        'id': user.id,
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'points': user.points,
                        'avatar': str(user.avatar),
                        'bio': user.bio,
                        'points': user.points,
                        # 'most_played_categories': user.most_played_categories,
                        'played_history': len(user.played_history.split('_')) - 2,
                        'likes': userLikesNumber,
                        'comments': userCommentsNumber,
                    }   
                )
            )
        except ObjectDoesNotExist:
            return HttpResponse('DoesNotExist')
        except Exception as e:
            return HttpResponse(e)
    
# def checkAlreadyUserExists(username, email):
#     return CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists() 

def verify_recaptcha(res):
    response = res.GET.get('r')
    RECAPTCHA_SECRET = config('RECAPTCHA_SECRET', cast=str)
    
    params = {
        'secret': RECAPTCHA_SECRET,
        'response': response
    }
    req = requests.post('https://www.google.com/recaptcha/api/siteverify', params)
    
    return HttpResponse((json.loads(req.content))['success'])
    
def auth_google(request, *args, **kwargs):
    payload = json.loads(request.body.decode('utf-8'))
    
    if request.method == 'POST':
        r = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', params={'access_token': payload['accessToken']})
        data = json.loads(r.text)

        if 'error' in data:
            content = {'message': 'wrong google token / this google token is already expired.'}
            return HttpResponse(content)

        def uniqueUsername():    
            # ugly function but im too tiered to do it
            try:
                selectUsername = f"{payload['username']}{random.randint(0, 9999)}"
                
                if CustomUser.objects.get(username=payload['username']):
                    return f"{selectUsername}_{payload['lastName']}"
                else:
                    return selectUsername
                
            except CustomUser.DoesNotExist:
                return payload['username']
        
        try:
            user = CustomUser.objects.get(email=data['email'])
            
            if user.is_active == False:
                return HttpResponse('inactive')
            
        except CustomUser.DoesNotExist:
            user = CustomUser()
            user.username = uniqueUsername()
            user.password = make_password(BaseUserManager().make_random_password())
            user.email = data['email']
            user.last_name = payload['lastName']
            user.first_name = payload['firstName']
            user.avatar = payload['avatar']
            user.save()
            
            first_notif = Notification()
            first_notif.user = user
            first_notif.message = f"{payload['firstName']} به کوییزلند خوش اومدی"
            first_notif.save()

        token = RefreshToken.for_user(user)  # generate token without username & password
        response = {}
        response['username'] = user.username
        response['access_token'] = str(token.access_token)
        response['refresh_token'] = str(token)
        
        return HttpResponse(json.dumps(response))
        
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

class CustomUserView(viewsets.ModelViewSet):
    permissions_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer
    filterset_class = CustomUserFilter
    
    def get_queryset(self):
        if self.request.user and self.request.method == 'GET':
            user = CustomUser.objects.filter(username=self.request.user.username)
            return user

class NotificationView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = NotificationSerializer
    filterset_class = NotificationFilter
    
    def get_queryset(self):
        if self.request.user and self.request.method == 'GET':
            notification_objects = Notification.objects.filter(user=self.request.user)
            last_index = notification_objects.count() - 1
            
            if notification_objects.exists():
                return notification_objects[last_index:]
            else:
                return Notification.objects.none()

# --------------------------------------------------------

class QuizView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = Quizzes.objects.all()
    serializer_class = QuizzesSerializer
    filterset_class = QuizzesFilter

class PointyView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = Quizzes_Pointy.objects.all()
    serializer_class = PointyQuizzesSerializer
    filterset_class = PointyQuizzesFilter

# --------------------------------------------------------

class LikeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = LikeSerializer
    filterset_class = LikeFilter
    
    def get_queryset(self):
        if self.request.user:
            like_objects = Like.objects.filter(user_id=self.request.user)
            
            if like_objects.exists():
                return like_objects
            else:
                return History.objects.none()
        
class CommentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filterset_class = CommentFilter
    
class WatchListView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = WatchListSerializer
    filterset_class = WatchListFilter

    def get_queryset(self):
        if self.request.user:
            watch_list_objects = Watch_List.objects.filter(user_id=self.request.user)
        
            if watch_list_objects.exists():
                return watch_list_objects
            else:
                return History.objects.none()
    
class HistoryView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = HistorySerializer
    filterset_class = HistoryFilter

    def get_queryset(self):
        if self.request.user:
            history_objects = History.objects.filter(user_id=self.request.user)
            
            if history_objects.exists():
                return history_objects
            else:
                return History.objects.none()
    
# --------------------------------------------------------

class CategoriesView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    filterset_class = CategoriesFilter

class SubCategoryView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = SubCategories.objects.all()
    serializer_class = SubCategoriesSerializer
    filterset_class = SubCategoriesFilter

# --------------------------------------------------------

class QuestionsView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    filterset_class = QuestionsFilter    

class QuestionsPointyView(viewsets.ModelViewSet):
    permission_classes = (BasePermission,)
    queryset = Pointy_Questions.objects.all()
    serializer_class = questionsPointySerializer
    filterset_class = questionsPointyFilter  

# --------------------------------------------------------

# class new_blogView(viewsets.ModelViewSet):
#     permission_classes = (IsAuthenticated,)
#     queryset = Blog.objects.all()
#     serializer_class = BlogSerializer
#     filterset_class = BlogFilter

# --------------------------------------------------------

# class newsletter_usersView(viewsets.ModelViewSet):
#     queryset = Newsletter_Users.objects.all()
#     serializer_class = NewsletterUsersSerializer
#     filterset_class = NewsletterUserFilter