from django.urls import path
from .views import index, quiz

urlpatterns = [
    path('', index),
    path('guide', index),
    path('contact', index),
    path('ads', index),
    path('support', index),
    path('privacy-policy', index),
    path('category/<category>', index),
    path('category/<category>/<subCategory>', index),
    path('quiz/<title>', quiz),
    path('result', index),
    path('search', index),
    path('sort', index),
    path('makeMonthlyRecord19931506', index),
    path('welcome/<target>', index),
    path('pageNotFound ', index),
]