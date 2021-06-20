from django.contrib import admin
import django.contrib.auth.admin
import django.contrib.auth.models
from django.contrib import auth
from .models import Document, Document_Admin,\
                    SubCategories, SubCategories_Admin,\
                    Quizzes, Quizzes_Admin,\
                    Quizzes_Pointy, Quizzes_Pointy_Admin,\
                    Questions, Questions_Admin,\
                    Pointy_Questions, Pointy_Questions_Admin,\
                    Newsletter_Users, Newsletter_Users_Admin,\
                    Thumbnil_SubCategory, Thumbnil_SubCategory_Admin

admin.site.site_header = "Quizland Admin Panel"

admin.site.register(Document, Document_Admin)
admin.site.register(SubCategories, SubCategories_Admin)
admin.site.register(Quizzes, Quizzes_Admin)
admin.site.register(Quizzes_Pointy, Quizzes_Pointy_Admin)
admin.site.register(Questions, Questions_Admin)
admin.site.register(Pointy_Questions, Pointy_Questions_Admin)
admin.site.register(Newsletter_Users, Newsletter_Users_Admin)
admin.site.register(Thumbnil_SubCategory, Thumbnil_SubCategory_Admin)

admin.site.unregister(auth.models.Group)