from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.contrib.sitemaps.views import sitemap
from .sitemaps import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from app import views

# sitemaps = {
#     'quiz':QuizSitemap,
#     'subCategory':SubCategorySitemap,
#     'category':CategorySitemap
# }

router = routers.DefaultRouter()
router.register(r'quiz_new', views.QuizView_Newest)
router.register(r'quiz_monthlyBest', views.QuizView_MonthlyBest)
router.register(r'quiz_best', views.QuizView_Best)
router.register(r'quiz_alphabet', views.QuizView_Alphabet)

router.register(r'pointy_new', views.PointyView_Newest)
router.register(r'pointy_monthlyBest', views.PointyView_MonthlyBest)
router.register(r'pointy_best', views.PointyView_Best)
router.register(r'pointy_alphabet', views.PointyView_Alphabet)

router.register(r'category_new', views.CategoryView_Newest)
router.register(r'category_best', views.CategoryView_Best)
router.register(r'category_alphabet', views.CategoryView_Alphabet)

router.register(r'questions', views.QuestionView)
router.register(r'questions_pointy', views.PointyQuestionView)

router.register(r'blog_new', views.BlogView_Newest)

# router.register(r'newsletter_users', views.newsletter_users)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/token/verify/', TokenVerifyView.as_view()),
    path('api/account/', include('app.urls')),
    
    
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('dbAPI/', include(router.urls)),
    
    # path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'), 
]