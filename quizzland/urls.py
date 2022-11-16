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

router.register(r'userView', views.CustomUserView, basename='CustomUserView')
router.register(r'messagesView', views.MessagesView, basename='MessagesView')

router.register(r'quizView', views.QuizView, basename='QuizView')
router.register(r'quizV2View', views.QuizV2View, basename='QuizV2View')
router.register(r'testView', views.PointyView, basename='PointyView')

router.register(r'userAnswerView', views.UserAnswerView, basename='UserAnswerView')
router.register(r'likeView', views.LikeView, basename='likeView')
router.register(r'commentView', views.CommentView, basename='CommentView')
router.register(r'watchListView', views.WatchListView, basename='watchListView')
router.register(r'historyView', views.HistoryView, basename='historyView')

router.register(r'categoryView', views.CategoriesView, basename='CategoriesView')
router.register(r'subcategoryView', views.SubCategoryView, basename='SubCategoryView')

router.register(r'questionsView', views.QuestionsView, basename='QuestionsView')
router.register(r'questionsV2View', views.QuestionsV2View, basename='QuestionsV2View')
router.register(r'questionsPointyView', views.QuestionsPointyView, basename='QuestionsPointyView')

urlpatterns = [
    path('adminTheKingAlexanderJosef/', admin.site.urls),
    path('api/', include(router.urls)),
    path('sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('frontend.urls')),   
]

handler404 = "frontend.views.handler404"