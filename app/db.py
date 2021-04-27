from crud import *
import datetime, time

def sortNewest():
    newest = s.query(Quizzes).limit(5)
    return newest

def sortMostViews():
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).limit(5)
    return mostViews

def addView(title):
    data = s.query(Quizzes).filter(Quizzes.title.ilike(title)).first()
    data.views += 1
    add_session(data)

def quizzes_sortByDate():
    quizzesByDate = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()
    return quizzesByDate

def quizzes_sortByViews():
    return




# def sortMostViewsForThisMonth():
#     mostViews = s.query(Quizzes).filter(
#         and_(
#             # most view
#             Quizzes.publish.between( datetime.datetime.now() - (datetime.datetime.now() - ) )
#         )
#     ).order_by(Quizzes.view.desc()).limit(2)

#     return
