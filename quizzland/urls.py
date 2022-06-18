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

router.register(r'user', views.CustomUser)

router.register(r'quiz', views.Quiz)
router.register(r'pointy', views.Pointy)

router.register(r'comment', views.Comment)

router.register(r'category', views.Categories)
router.register(r'subcategory', views.SubCategory)

router.register(r'questions', views.Questions)
router.register(r'questions_pointy', views.Questions_pointy)

# router.register(r'new_blog', views.new_blog)

# router.register(r'newsletter_users', views.newsletter_users)

urlpatterns = [
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('api/', include(router.urls)),
    path('sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('frontend.urls')),   
]

handler404 = "frontend.views.handler404"