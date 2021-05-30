import os.path as op
from view import *
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_admin.contrib.fileadmin import FileAdmin

admin = Admin(
    app,
    index_view=AdminIndexView(
        url='/admin/$Quizland19931506'
    )
)

app.secret_key = '$Postgresql19931506'

admin.add_view(ModelView(Categories, session()))

admin.add_view(ModelView(Quizzes, session()))
admin.add_view(ModelView(QuizzesPointy, session()))

admin.add_view(ModelView(quizQuestions, session()))
admin.add_view(ModelView(quizPointyQuestions, session()))

path = op.join(op.dirname(__file__), 'static')

admin.add_view(ModelView(NewsletterUser, session()))

admin.add_view(FileAdmin(path, '/static/', name='Static Files'))

admin.add_view(ModelView(Documents, session()))