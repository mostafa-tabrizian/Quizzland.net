from crud import *
import datetime, time

def sortNewest():
    newest = s.query(Quizzes).limit(5)
    return newest

def sortMostViews():
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).limit(5)
    return mostViews

def addViewToQuizzes(title):
    data = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    data.views += 1
    add_session(data)

def addViewToCategories(title):
    data = s.query(Categories).filter(Categories.title_eng.ilike(f'%{title}%')).first()
    data.views += 1
    add_session(data)

def categories():
    categories = s.query(Categories).all()[0:2]
    return categories

def quizzes_sortByDate():
    quizzesByDate = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()
    return quizzesByDate

def quizzes_sortByViews():
    return

def quizzes_FilterByTitle(Title):
    quizzesFilterByTitle = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{Title}%')).all()
    return quizzesFilterByTitle



# def sortMostViewsForThisMonth():
#     mostViews = s.query(Quizzes).filter(
#         and_(
#             # most view
#             Quizzes.publish.between( datetime.datetime.now() - (datetime.datetime.now() - ) )
#         )
#     ).order_by(Quizzes.view.desc()).limit(2)

#     return
