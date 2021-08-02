from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from frontend import views
from django.contrib.sitemaps.views import sitemap
from .sitemaps import *

sitemaps = {
    'quiz':QuizSitemap,
    'subCategory':SubCategorySitemap
}

router = routers.DefaultRouter()

router.register(r'new_quiz', views.new_quiz)
router.register(r'monthlyBest_quiz', views.monthlyBest_quiz)
router.register(r'best_quiz', views.best_quiz)
router.register(r'alphabet_quiz', views.alphabet_quiz)

router.register(r'new_category', views.new_category)
router.register(r'best_category', views.best_category)
router.register(r'alphabet_category', views.alphabet_category)

router.register(r'questions', views.questions)

router.register(r'newsletter_users', views.newsletter_users)

urlpatterns = [
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('dbQuizzland$M19931506/', include(router.urls)),
    path('sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('frontend.urls')),   
]

handler404 = "frontend.views.handler404"