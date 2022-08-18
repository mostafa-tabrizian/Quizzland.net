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

router.register(r'userView', views.CustomUserView)

router.register(r'quizView', views.QuizView)
router.register(r'testView', views.PointyView)

router.register(r'commentView', views.CommentView)

router.register(r'categoryView', views.CategoriesView)
router.register(r'subcategoryView', views.SubCategoryView)

router.register(r'questionsView', views.QuestionsView)
router.register(r'questionsPointyView', views.QuestionsPointyView)

# router.register(r'new_blog', views.new_blog)

# router.register(r'newsletter_users', views.newsletter_users)

urlpatterns = [
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('api/', include(router.urls)),
    path('sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('frontend.urls')),   
]

handler404 = "frontend.views.handler404"