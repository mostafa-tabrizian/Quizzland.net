# encoding=utf-8

from django.contrib import admin
from .models import Document, InnerCategories,\
                    Quizzes, Quiz_Questions,\
                    Quizzes_Pointy, Quiz_Pointy_Questions,\
                    Newsletter

admin.site.register(Document)
admin.site.register(InnerCategories)
admin.site.register(Quizzes)
admin.site.register(Quiz_Questions)
admin.site.register(Quizzes_Pointy)
admin.site.register(Quiz_Pointy_Questions)
admin.site.register(Newsletter)