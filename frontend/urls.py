from django.urls import path, re_path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # re_path(r'^(?P<SOS>.*)/$', SOS),  # SOS Time
    # re_path('', SOS_landpage),  # SOS Time
    
    path('api/token/obtain/', TokenObtainPairView.as_view(serializer_class=CustomJWTSerializer), name='token_create'),  # override sjwt stock token
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('api/user', user_data),
    path('api/profile', public_profile),
    path('api/google', auth_google),
    # path("api/reset_password", resetPassword),
    path("api/recaptcha", verify_recaptcha),
    path("api/user/update", user_update),
    path("api/user/notifications", user_notification),
    
    path('login', index),
    
    path('profile/setting', index),
    path('profile/playlist', index),
    path('profile/<user>', index),
    
    path('', index),
    path('guide', index),
    path('contact', index),
    # path('advertiseContact', index),
    path('support', index),
    path('privacy-policy', index),
    
    path('category/<category>', index),
    path('category/<category>/<subCategory>', index),
    
    path('quiz/<title>', index),
    path('test/<title>', index),
    path('result', index),
    
    path('search', index),
    path('tags/<tag>', index),
    path('sort', index),
    # path('blog/<title>', article),
    # path('blog', blog),
    path('makeMonthlyRecord', index),
    path('restartEveryMonthlyViews', restartEveryMonthlyViews),
    
    path('404', index),
    
    path('welcomeOwl', index),
    path('welcomeZeynab', index)
]