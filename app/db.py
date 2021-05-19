from crud import *
from sqlalchemy import and_

# ------------------Category
def grabNewestCategories(category):
    category = s.query(Categories).filter(Categories.category == category)\
                                  .order_by(Categories.publish.desc())
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
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{title}%'))\
                                  .order_by(Quizzes.publish.desc())
    return grabbedQuiz
    
def grabNewestQuizzes4Option(title):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{title}%'))
    return grabbedQuiz
    
def grabBestestQuizzes(title):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{title}%'))\
                                  .order_by(Quizzes.views.desc())
    return grabbedQuiz

def grabBestestQuizzes4Option(title):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.title_far.ilike(f'%{title}%'))\
                                         .order_by(Quizzes4Option.views.desc())
    return grabbedQuiz

def grabAlphabetQuizzes(title):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{title}%'))\
                                  .order_by(Quizzes.innerCategory.asc())
    return grabbedQuiz

def grabAlphabetQuizzes4Option(title):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.title_far.ilike(f'%{title}%'))\
                                         .order_by(Quizzes4Option.title_far.asc())
    return grabbedQuiz

def grabQuizzes(category, innerCategory, fr, to, sortType):
    if category == 'physiologies':
        if sortType == 'newest':
            grabbedQuizzes = grabNewestQuizzes4Option(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = grabBestestQuizzes4Option(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = grabAlphabetQuizzes4Option(innerCategory).all()[fr:to]
    else:
        if sortType == 'newest':
            grabbedQuizzes = grabNewestQuizzes(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = grabBestestQuizzes(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = grabAlphabetQuizzes(innerCategory).all()[fr:to]

    return grabbedQuizzes

def grabFirstQuizByFarsiTitle(title):
    quizzesGrabbedByFarsiTitle = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    quizzes4OptionGrabbedByFarsiTitle = s.query(Quizzes4Option).filter(Quizzes4Option.title_far.ilike(f'%{title}%')).first()



    if checkIfNotNoneTypeOrNone(quizzesGrabbedByFarsiTitle):
        data = quizzesGrabbedByFarsiTitle
    elif checkIfNotNoneTypeOrNone(quizzes4OptionGrabbedByFarsiTitle):
        data = quizzes4OptionGrabbedByFarsiTitle
    return data

def grabQuizQuestion(titleFar):
    questionGrabbed = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(titleFar)).all()\
        + s.query(fourOptionQuizQuestions).filter(fourOptionQuizQuestions.title_far.ilike(titleFar)).all()
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
    quizToAddView = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    quiz4OptionToAddView = s.query(Quizzes4Option).filter(Quizzes4Option.title_far.ilike(f'%{title}%')).first()

    if checkIfNotNoneTypeOrNone(quizToAddView):
        data = quizToAddView
    elif checkIfNotNoneTypeOrNone(quiz4OptionToAddView):
        data = quiz4OptionToAddView

    addView(data)
    add_session(data)

def checkIfNotNoneTypeOrNone(data):
    return data != 'NoneType' and data is not None

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