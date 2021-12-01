from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from frontend.views import *
from django.contrib.sitemaps.views import sitemap

from .sitemaps import *

sitemaps = {
    'quiz':QuizSitemap,
    'subCategory':SubCategorySitemap,
    'category':CategorySitemap
}

router = routers.DefaultRouter()

router.register(r'new_quiz', new_quiz)
router.register(r'monthlyBest_quiz', monthlyBest_quiz)
router.register(r'best_quiz', best_quiz)
router.register(r'alphabet_quiz', alphabet_quiz)

router.register(r'new_pointy_quiz', new_pointy_quiz)
router.register(r'monthlyBest_pointy_quiz', monthlyBest_pointy_quiz)
router.register(r'best_pointy_quiz', best_pointy_quiz)
router.register(r'alphabet_pointy_quiz', alphabet_pointy_quiz)

router.register(r'new_category', new_category)
router.register(r'best_category', best_category)
router.register(r'alphabet_category', alphabet_category)

router.register(r'questions', questions)
router.register(r'pointyQuestions', pointyQuestions)

router.register(r'new_blog', new_blog)

# router.register(r'newsletter_users', newsletter_users)

urlpatterns = [
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('dbAPI/', include(router.urls)),
    path('api/token/auth/', CustomAuthToken.as_view()),
    path('sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.sitemap'),
    path('', include('frontend.urls')),   
]

handler404 = "frontend.views.handler404"