from crud import *
from sqlalchemy import and_

# ------------------Category
def grabNewestCategories(category):
    category = s.query(Categories).filter(Categories.category == category)
    return category

def grabBestestCategory(category):
    category = s.query(Categories).filter(Categories.category == category)\
        .order_by(Categories.views.desc())
    return category

def grabAlphabetCategory(category):
    category = s.query(Categories).filter(Categories.category == category)\
                                  .order_by(Categories.title_eng.asc())
    return category

def grabCategories(category, fr, to, sortType):
    if sortType == 'newest':
        categories = grabNewestCategories(category).all()[fr:to]
    elif sortType == 'bestest':
        categories = grabBestestCategory(category).all()[fr:to]
    elif sortType == 'alphabet':
        categories = grabAlphabetCategory(category).all()[fr:to]
    return categories

def grabAllCategoriesByPublish():
    categoryGrabbedByPublish = s.query(Categories).order_by(Categories.publish.desc())
    return categoryGrabbedByPublish

def grabAllCategoriesByViews():
    quizzesGrabbedByPublish = s.query(Categories).order_by(Categories.views.desc())
    return quizzesGrabbedByPublish

# ------------------Quizzes

def grabNewestQuizzes(title):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{title}%'))
    return grabbedQuiz
    
def grabBestestQuizzes(title):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{title}%'))\
                              .order_by(Quizzes.views.desc())
    return grabbedQuiz

def grabAlphabetQuizzes(title):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{title}%'))\
                              .order_by(Quizzes.title_eng.asc())
    return grabbedQuiz
    
def grabQuizzes(innerCategory, fr, to, sortType):
    if sortType == 'newest':
        grabbedQuizzes = grabNewestQuizzes(innerCategory).all()[fr:to]
    elif sortType == 'bestest':
        grabbedQuizzes = grabBestestQuizzes(innerCategory).all()[fr:to]
    elif sortType == 'alphabet':
        grabbedQuizzes = grabAlphabetQuizzes(innerCategory).all()[fr:to]
    return grabbedQuizzes

def grabFirstQuizByFarsiTitle(title):
    quizzesGrabbedByFarsiTitle = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    return quizzesGrabbedByFarsiTitle

def grabQuizQuestion(quiestion):
    questionGrabbed = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(quiestion)).all()\
        + s.query(fourOptionQuizQuestions).filter(fourOptionQuizQuestions.title_far.ilike(quiestion)).all()
    return questionGrabbed

def grabAllQuizzesByPublish():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.publish.desc())
    return quizzesGrabbedByPublish

def grabLimitedQuizzesByPublish():
    limitedQuizzesGrabbedByPublish = grabAllQuizzesByPublish().limit(5)
    return limitedQuizzesGrabbedByPublish

def grabLimitedQuizzesForNewestPage(fr, to):
    limitedQuizzesForNewestPage = grabAllQuizzesByPublish().all()[fr:to]
    return limitedQuizzesForNewestPage

def grabAllQuizzesByViews():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.views.desc())
    return quizzesGrabbedByPublish

def grabLimitedQuizzesByViews():
    limitedQuizzesGrabbedByViews = grabAllQuizzesByViews().limit(5)
    return limitedQuizzesGrabbedByViews

def grabLimitedQuizzesForMostViewsPage(fr, to):
    limitedQuizzesForNewestPage = grabAllQuizzesByViews().all()[fr:to]
    return limitedQuizzesForNewestPage

def fanNameOfQuiz(title):
    quiz_Detail = grabFirstQuizByFarsiTitle(title)
    fanName = quiz_Detail.fan_name
    return fanName

# ------------------Others

def addView(whichShouldAddViewToIt):
    whichShouldAddViewToIt.views += 1

def addViewToCategories(title):
    data = s.query(Categories).filter(Categories.title_eng.ilike(f'%{title}%')).first()
    addView(data)
    add_session(data)

def addViewToQuizzes(title):
    data = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    addView(data)
    add_session(data)


def finalPage(howManyElementToShow, whichSortWantToKnowTheFinalPage):
    if whichSortWantToKnowTheFinalPage == 'newest':
        sort = grabAllQuizzesByPublish().all()
    elif whichSortWantToKnowTheFinalPage == 'mostViews':
        sort = grabAllQuizzesByViews().all()
    else:
        try:
            category = whichSortWantToKnowTheFinalPage
            sort = grabNewestCategories(category).all()
        except:
            quizzes = whichSortWantToKnowTheFinalPage
            sort = grabNewestQuizzes(quizzes).all()

    finalPage = round((len(sort)) / howManyElementToShow)

    if finalPage <= 0:
        finalPage = '1'
        return finalPage
    else:
        str(finalPage)
        return finalPage