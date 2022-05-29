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

router.register(r'quiz', views.quiz)

router.register(r'pointy', views.pointy)

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