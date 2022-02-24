from django.contrib import admin
import django.contrib.auth.admin
import django.contrib.auth.models
from django.contrib import auth
from .models import *

admin.site.site_header = "Quizzland Admin Panel"

class Categories_Admin(admin.ModelAdmin):
    list_display = ('title_english', 'title_persian', 'date_published')
admin.site.register(Categories, Categories_Admin)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Document, Document_Admin)

class SubCategories_Admin(admin.ModelAdmin):
    list_display = ('subCategory', 'title', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory','publish')
    search_fields = ['id', 'title']
admin.site.register(SubCategories, SubCategories_Admin)


class Quizzes_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('category', 'publish')
    search_fields = ['id', 'title']
admin.site.register(Quizzes, Quizzes_Admin)


class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'category', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'category', 'publish')
    search_fields = ['id', 'title']
admin.site.register(Quizzes_Pointy, Quizzes_Pointy_Admin)

admin.site.register(Questions, Questions_Admin)
admin.site.register(Pointy_Questions, Pointy_Questions_Admin)
admin.site.register(Blog, Blog_Admin)
# admin.site.register(Newsletter_Users, Newsletter_Users_Admin)

admin.site.unregister(auth.models.Group)