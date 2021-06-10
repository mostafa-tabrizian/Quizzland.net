from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('search', views.search),
    path('search/<target>', views.searchMore),
    path('category/<categoryArg>/<int:page>/<sortType>/<numberOfResult>',views.category),
    path('category/<category>/<innerCategory>/<int:page>/<sortType>/<numberOfResult>',views.innerCategory),
    path('quiz/<category>/<innerCategory>/<title>', views.quiz),
    path('quizPointy/<category>/<innerCategory>/<title>', views.quizPointy),
    path('result/<innerCategory>/<title>', views.result),
    path('resultPointy/<title>/<int:score>', views.resultPointy),
    path('<sortOfQuiz>/<int:page>', views.sortTheQuizzes),
    path('<sortOfQuiz>/<category>/<int:page>', views.sortTheQuizzesByCategory),
    path('contact', views.contact),
    path('privacy-policy', views.privacyPolicy),
    path('guide', views.guide),
    path('adverts', views.adverts),
    path('support', views.support),
    path('newsletter', views.newsletter),
    path('404', views.pageNotFoundManual),
]