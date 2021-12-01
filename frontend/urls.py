from django.urls import path, re_path
from .views import index, quiz, category, subCategory, blog, article, restartEveryMonthlyViews, \
                    SOS, SOS_landpage, newProfile

urlpatterns = [
    # re_path(r'^(?P<SOS>.*)/$', SOS),  # SOS Time
    # re_path('', SOS_landpage),  # SOS Time

    path('', index),

    path('profile', index),
    path('signUp', index),
    path('signIn', index),
    path('newProfile', newProfile),
    path('dashboard', index),

    path('guide', index),
    path('contact', index),
    path('ads', index),
    path('support', index),
    path('privacy-policy', index),

    path('category/<category>', category),
    path('category/<category>/<subCategory>', subCategory),

    path('quiz/<title>', quiz),
    path('test/<title>', quiz),
    path('result/s', quiz),
    path('result_p/s', quiz),

    path('search', index),

    path('sort', index),

    path('blog/<title>', article),
    path('blog', blog),

    path('makeMonthlyRecord', index),
    path('restartEveryMonthlyViews', restartEveryMonthlyViews),

    path('welcomeOwl', index),
    path('welcomeZeynab', index),
]