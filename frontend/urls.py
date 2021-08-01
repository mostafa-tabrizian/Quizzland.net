from django.urls import path
from .views import index, quiz, category, subCategory

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
    path('result', index),
    path('search', index),
    path('sort', index),
    path('makeMonthlyRecord19931506', index),
    path('welcome/<target>', index),
    path('pageNotFound ', index),
]