from django.urls import path, re_path
from django.conf.urls import url
from .views import *

urlpatterns = [
    path('', index),
    path('search', search),
    path('category/<categoryArg>', category),
    path('category/<category>/<innerCategory>',innerCategory),
    path('quiz/<title>', quiz),
    path('quizPointy/<title>', quizPointy),
    path('result', result),
    path('resultPointy', resultPointy),
    path('sort', sortTheQuizzes),
    path('contact', contact),
    path('privacy-policy', privacyPolicy),
    path('guide', guide),
    path('adverts', adverts),
    path('support', support),
    path('newsletter', newsletter),

    url(r'^ajax/doesExistInNewsletterUsers/$', doesExistInNewsletterUsers, name='doesExistInNewsletterUsers'),
]