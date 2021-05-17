from crud import *

def sortNewest():
    newest = s.query(Quizzes).order_by(Quizzes.publish.desc()).limit(5)
    return newest

def newestQuizForNewestPage(fr, to):
    newest = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()[fr:to]
    return newest

def sortMostViews():
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).limit(5)
    return mostViews

def mostViewsQuizForMostViewsPage(fr, to):
    mostViews = s.query(Quizzes).order_by(Quizzes.views.desc()).all()[fr:to]
    return mostViews

def finalPage(howManyElementToShow, whichSortWantToKnowTheFinalPage):
    if whichSortWantToKnowTheFinalPage == 'newest':
        sort = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()
    elif whichSortWantToKnowTheFinalPage == 'mostViews':
        sort = s.query(Quizzes).order_by(Quizzes.views.desc()).all()
    else:
        try:
            category = whichSortWantToKnowTheFinalPage
            sort = s.query(Categories).filter(Categories.category == category).all()
        except:
            innerCategory = whichSortWantToKnowTheFinalPage
            sort = s.query(Quizzes).filter(Quizzes.title_eng == innerCategory).all()

    finalPage = round((len(sort)) / howManyElementToShow) - 1

    if finalPage <= 0:
        finalPage = '1'
        return finalPage
    else:
        str(finalPage)
        return finalPage

def addView(whichShouldAddViewToIt):
    whichShouldAddViewToIt.views += 1

def addViewToQuizzes(title):
    data = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    addView(data)
    add_session(data)

def addViewToCategories(title):
    data = s.query(Categories).filter(Categories.title_eng.ilike(f'%{title}%')).first()
    addView(data)
    add_session(data)

def categories(category, fr, to):
    categories = s.query(Categories).filter(Categories.category == category).all()[fr:to]
    return categories

def quizzes_sortByDate():
    quizzesByDate = s.query(Quizzes).order_by(Quizzes.publish.desc()).all()
    return quizzesByDate

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