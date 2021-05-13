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

def categories(category, fr, to):
    categories = s.query(Categories).filter(Categories.category == category).all()[fr:to]
    return categories

def lastPage(category):
    categories = s.query(Categories).filter(Categories.category == category).all()
    elementInEachPage = 2
    lastPage = str(round((len(categories)) / elementInEachPage))
    return lastPage

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

def quiz_Question(title):
    quiz_Question = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(title)).all()
    return quiz_Question