from django.urls import path, re_path
from .views import index, quiz, category, subCategory, article, article, restartEveryMonthlyViews, SOS, SOS_landpage

urlpatterns = [
    # re_path(r'^(?P<SOS>.*)/$', SOS),  # SOS Time
    # re_path('', SOS_landpage),  # SOS Time

    path('', index),
    path('guide', index),
    path('contact', index),
    path('ads', index),
    path('support', index),
    path('privacy-policy', index),
    path('category/<category>', category),
    path('category/<category>/<subCategory>', subCategory),
    path('quiz/<title>', quiz),
    path('test/<title>', quiz),
    path('result/<title>', quiz),
    path('result_p/<title>', quiz),
    path('search', index),
    path('sort', index),
    path('article/<title>', article),
    path('article', article),
    path('makeMonthlyRecord', index),
    path('restartEveryMonthlyViews', restartEveryMonthlyViews),
    path('welcomeOwl', index),
    path('welcomeZeynab', index),
]