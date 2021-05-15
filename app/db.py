from crud import *

def sortNewest():
    newest = s.query(Quizzes).order_by(Quizzes.publish.desc()).limit(5)
    return newest

def newestQuizForNewestPage(fr, to):
    newest = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()[fr:to]
    return newest

def lastPageOfNewest(howManyElementToShow):
    newest = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()
    lastPageOfNewest = str(round((len(newest)) / howManyElementToShow) - 1)
    return lastPageOfNewest

def sortMostViews():
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).limit(5)
    return mostViews

def mostViewsQuizForMostViewsPage(fr, to):
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).all()[fr:to]
    return mostViews

def lastPageOfMostViews(howManyElementToShow):
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).all()
    lastPageOfMostViews = str(round((len(mostViews)) / howManyElementToShow) - 1)
    return lastPageOfMostViews

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

def lastPageOfCategory(category, howManyElementToShow):
    categories = s.query(Categories).filter(Categories.category == category).all()
    lastPage = str(round((len(categories)) / howManyElementToShow) - 1)
    return lastPage

def quizzes_sortByDate():
    quizzesByDate = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()
    return quizzesByDate

def quizzes_sortByViews():
    return

def quizzes_FilterByTitle(Title):
    quizzesFilterByTitle = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{Title}%')).all()
    return quizzesFilterByTitle

def quiz_Question(title):
    quiz_Question = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(title)).all()
    return quiz_Question

def quizDetail(title):
    quiz_Detail = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    return quiz_Detail


def fanNameOfQuiz(title):
    quiz_Detail = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    fanName = quiz_Detail.fan_name
    return fanName