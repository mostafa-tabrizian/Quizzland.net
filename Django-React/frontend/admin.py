from django.contrib import admin
import django.contrib.auth.admin
import django.contrib.auth.models
from django.contrib import auth
from .models import *

admin.site.site_header = "Quizzland Admin Panel"

@admin.register(Categories)
class Categories_Admin(admin.ModelAdmin):
    list_display = ('title_english', 'monthly_views', 'views', 'title_persian', 'publish')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Document, Document_Admin)


@admin.register(SubCategories)
class SubCategories_Admin(admin.ModelAdmin):
    list_display = ('subCategory', 'title', 'categoryKey', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title']


@admin.register(Quizzes)
class Quizzes_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'categoryKey', 'rate', 'rate_count', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']

@admin.register(Quizzes_Pointy)
class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'categoryKey', 'rate', 'rate_count', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']

@admin.register(Questions)
class Questions_Admin(admin.ModelAdmin):
    list_display = ('quizKey', 'question', 'answer_text')
    search_fields = ['question']

@admin.register(Pointy_Questions)
class Pointy_Questions_Admin(admin.ModelAdmin):
    list_display = ('quizKey', 'question')
    search_fields = ['question']

admin.site.register(Blog, Blog_Admin)
# admin.site.register(Newsletter_Users, Newsletter_Users_Admin)

admin.site.unregister(auth.models.Group)