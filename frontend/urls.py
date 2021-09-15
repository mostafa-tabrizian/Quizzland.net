from django.urls import path
from .views import index, quiz, category, subCategory, blog, article

urlpatterns = [
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