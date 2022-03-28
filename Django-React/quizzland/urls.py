from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from frontend import views
from django.contrib.sitemaps.views import sitemap
from .sitemaps import *

sitemaps = {
    'quiz':QuizSitemap,
    'test': PointySitemap,
    'subCategory':SubCategorySitemap,
    'category':CategorySitemap
}

router = routers.DefaultRouter()

router.register(r'quiz_new', views.quiz_new)
router.register(r'quiz_monthly', views.quiz_monthly)
router.register(r'quiz_best', views.quiz_best)
router.register(r'quiz_alphabet', views.quiz_alphabet)

router.register(r'pointy_new', views.pointy_new)
router.register(r'pointy_monthly', views.pointy_monthly)
router.register(r'best_pointy_quiz', views.best_pointy_quiz)
router.register(r'pointy_alphabet', views.pointy_alphabet)

router.register(r'categories', views.Categories)

router.register(r'subcategory_new', views.SubCategory_new)
router.register(r'subcategory_best', views.SubCategory_best)
router.register(r'subcategory_alphabet', views.SubCategory_alphabet)

router.register(r'questions', views.questions)
router.register(r'questions_pointy', views.questions_pointy)

# router.register(r'new_blog', views.new_blog)

# router.register(r'newsletter_users', views.newsletter_users)

urlpatterns = [
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('api/', include(router.urls)),
    path('sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('frontend.urls')),   
]

handler404 = "frontend.views.handler404"