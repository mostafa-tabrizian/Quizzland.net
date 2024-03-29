from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

admin.site.site_header = "Quizzland Admin Panel"

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'last_name', 'first_name')
    list_filter = ('birthday_date', 'gender', 'blocked')
    search_fields = ['username', 'email', 'last_name', 'first_name']
    
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
                    'q_coins',
                ),
            },
        ),
    )
    
admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Messages)
class MessagesAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'created_at', 'has_read')
    list_filter = ('user', 'type', 'created_at', 'has_read')
    search_fields = ['user', 'message']

@admin.register(Categories)
class Categories_Admin(admin.ModelAdmin):
    list_display = ('title_english', 'monthly_views', 'views', 'title_persian', 'publish')

admin.site.register(Document, Document_Admin)


@admin.register(SubCategories)
class SubCategories_Admin(admin.ModelAdmin):
    list_display = ('subCategory', 'title', 'categoryKey', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title']


@admin.register(Quizzes_V2)
class QuizzesV2_Admin(admin.ModelAdmin):
    list_display = ('title', 'categoryKey', 'monthly_views', 'views', 'publish')
    exclude = ('type', )
    list_filter = ('categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']
    
@admin.register(Quizzes)
class Quizzes_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'categoryKey', 'monthly_views', 'views', 'publish')
    exclude = ('type', )
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']

@admin.register(Quizzes_Pointy)
class Quizzes_Pointy_Admin(admin.ModelAdmin):
    list_display = ('title', 'subCategory', 'categoryKey', 'monthly_views', 'views', 'publish')
    list_filter = ('subCategory', 'categoryKey', 'publish')
    search_fields = ['id', 'title', 'slug']

@admin.register(UserAnswer)
class UserAnswer_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'question_id', 'user_answer', 'correct_answer', 'date_submitted')
    list_filter = ('date_submitted', )
    search_fields = ['user_id__username', 'question_id__question']

@admin.register(UserScore)
class UserScore_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'quiz_id', 'score', 'got_help', 'date_submitted')
    list_filter = ('date_submitted', )
    search_fields = ['user_id__username', 'quiz_id__slug']

@admin.register(Like)
class Like_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'quiz_id', 'date_submitted')
    list_filter = ('date_submitted', )
    search_fields = ['test_id__title', 'test_id__slug', 'quizV2_id__title', 'quizV2_id__slug']

@admin.register(Comment)
class Comment_Admin(admin.ModelAdmin):
    list_display = ('submitter_id', 'comment_text', 'verified', 'date_submitted')
    list_filter = ('date_submitted', 'verified')
    search_fields = ['comment_text', 'quizV2_id__title', 'quizV2_id__slug', 'test_id__title', 'test_id__slug', 'submitter_id__username']

@admin.register(Watch_List)
class WatchList_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'quiz_id', 'date_submitted')
    list_filter = ('date_submitted', )
    search_fields = ['quizV2_id__title', 'quizV2_id__slug', 'test_id__title', 'test_id__slug']

@admin.register(History)
class History_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'quiz_id', 'date_submitted')
    list_filter = ('date_submitted', )
    search_fields = ['quizV2_id__title', 'quizV2_id__slug', 'test_id__title', 'test_id__slug']

@admin.register(Questions)
class Questions_Admin(admin.ModelAdmin):
    list_display = ('quizKey', 'question', 'answer_text')
    search_fields = ['question']

@admin.register(Questions_V2)
class QuestionsV2_Admin(admin.ModelAdmin):
    list_display = ('quizKey', 'question')
    search_fields = ['question']
    
@admin.register(Answer_V2)
class AnswerV2_Admin(admin.ModelAdmin):
    list_display = ('questionKey', 'answer', 'answer_text')
    search_fields = ['questionKey', 'answer_text']

@admin.register(Pointy_Questions)
class Pointy_Questions_Admin(admin.ModelAdmin):
    list_display = ('quizKey', 'question')
    search_fields = ['question']
    
@admin.register(Report)
class Report_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'title', 'date_submitted')
    search_fields = ['title', 'description']
    
@admin.register(DailyReward)
class DailyReward_Admin(admin.ModelAdmin):
    list_display = ('user_id', 'date')
    search_fields = ['user_id', ]