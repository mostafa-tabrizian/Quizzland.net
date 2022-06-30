from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
from django.contrib.auth.models import User

admin.site.site_header = "Quizzland Admin Panel"

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'last_name', 'first_name')
    list_filter = ('birthday_date', 'gender', 'blocked')
    search_fields = ['username', 'last_name', 'first_name']
    
    fieldsets = (
        *UserAdmin.fieldsets,  # original form fieldsets, expanded
        (                      # new fieldset added on to the bottom
            'More',  # group heading of your choice; set to None for a blank space instead of a header
            {
                'fields': (
                    'blocked',
                    'avatar',
                    'bio',
                    'birthday_date',
                    'gender',
                    'most_played_categories',
                    'played_history',
                    'liked_quizzes',
                    'watch_list',
                    'points',
                ),
            },
        ),
    )
    
admin.site.register(CustomUser, CustomUserAdmin)
    

@admin.register(Categories)
class Categories_Admin(admin.ModelAdmin):
    list_display = ('title_english', 'monthly_views', 'views', 'title_persian', 'publish')

admin.site.register(Document, Document_Admin)


@admin.register(SubCategories)
class SubCategories_Admin(admin.ModelAdmin):
    list_display = ('subCategory', 'title', 'categoryKey', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title']


@admin.register(Quizzes)
class Quizzes_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'categoryKey', 'like', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']

@admin.register(Quizzes_Pointy)
class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'categoryKey', 'like', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']

@admin.register(Comments)
class Comments_Admin(admin.ModelAdmin):
    list_display = ('submitter_related', 'comment_text', 'verified', 'date_submitted')
    list_filter = ('date_submitted', 'verified')
    search_fields = ('comment_text', 'quiz_related', 'test_related', 'submitter_related')

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