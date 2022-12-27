from django.urls import path, re_path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # re_path(r'^(?P<SOS>.*)/$', SOS),  # SOS Time
    # re_path('', SOS_landpage),  # SOS Time
    
    path('api/token/obtain/', TokenObtainPairView.as_view(serializer_class=CustomJWTSerializer), name='token_create'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('api/profile', public_profile),
    path('auth', auth_google),
    path("api/recaptcha", verify_recaptcha),
    path('api/search_user', search_user),
    path('api/answer', answer),
    path('api/answers_poll', answers_poll),
    path('api/send_report', send_report),
    path('api/daily_reward', daily_reward),
    
    path('login', index),
    
    path('profile/setting', index),
    path('profile/playlist', index),
    path('profile/<user>', index),
    path('profile/messages', index),
    
    path('', index),
    # path('guide', index),
    # path('contact', index),
    # path('advertiseContact', index),
    path('support', index),
    path('privacy-policy', index),
    
    path('contents', index),
    path('contents/<category>', index),
    
    path('quiz/<title>', index),
    path('test/<title>', index),
    path('play/<title>', index),
    path('result', index),
    
    path('search', index),
    path('tags/<tag>', index),
    # path('blog/<title>', article),
    # path('blog', blog),
    
    path('staff/panel', index),
    
    path('staff/trivia/create', index),
    path('staff/trivia/overview', index),
    
    path('staff/trivia/question/add', index),
    path('staff/trivia/question/overview', index),
    
    path('staff/test/create', index),
    path('staff/test/overview', index),
    path('staff/test/question/add', index),
    
    path('makeMonthlyRecord', index),
    path('restartEveryMonthlyViews', restartEveryMonthlyViews),
    
    path('404', index),
    
    path('welcomeOwl', index),
    path('welcomeZeynab', index)
]