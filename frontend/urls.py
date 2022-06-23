from django.urls import path, re_path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # re_path(r'^(?P<SOS>.*)/$', SOS),  # SOS Time
    # re_path('', SOS_landpage),  # SOS Time
    
    path('api/token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),

    path('', index),
    path('guide', index),
    path('contact', index),
    # path('advertiseContact', index),
    path('support', index),
    path('privacy-policy', index),
    
    path('category/<category>', index),
    path('category/<category>/<subCategory>', index),
    
    path('login', index),
    path('register', index),
    path('setPassword', setPassword),
    path('profile/<user>', index),
    path('setting', index),
    path('quiz-history', index),
    
    path('quiz/<title>', index),
    path('test/<title>', index),
    path('result', index),
    path('quiz-not-found', index),
    
    path('search', index),
    path('tags/<tag>', index),
    path('sort', index),
    # path('blog/<title>', article),
    # path('blog', blog),
    path('makeMonthlyRecord', index),
    path('restartEveryMonthlyViews', restartEveryMonthlyViews),
    
    # path('renameQuestions', renameQuestions),
    
    path('welcomeOwl', index),
    path('welcomeZeynab', index)
]