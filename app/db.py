from crud import *
import datetime, time

def sortNewest():
    newest = s.query(Quizzes).limit(2)
    return newest

def sortMostViews():
    mostViews = s.query(Quizzes).order_by(Quizzes.view.desc()).limit(2)
    return mostViews

def addView(title):
    data = s.query(Quizzes).filter(Quizzes.title.ilike(title)).first()
    data.view += 1
    add_session(data)



# def sortMostViewsForThisMonth():
#     mostViews = s.query(Quizzes).filter(
#         and_(
#             # most view
#             Quizzes.publish.between( datetime.datetime.now() - (datetime.datetime.now() - ) )
#         )
#     ).order_by(Quizzes.view.desc()).limit(2)

#     return
