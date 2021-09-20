from django.urls import path, re_path
from .views import index, quiz, category, subCategory, blog, article, SOS, SOS_landpage

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
    path('blog/<title>', article),
    path('blog', blog),
    path('makeMonthlyRecord', index),
    path('welcomeOwl', index),
    path('welcomeZeynab', index),
]