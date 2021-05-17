from crud import *

def grabThisCategory(category):
    category = s.query(Categories).filter(Categories.category == category)
    return category

def  grabQuizzesByPublish():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.publish.desc())
    return quizzesGrabbedByPublish

def grabFirstQuizzesByFarsiTitle(title):
    quizzesGrabbedByFarsiTitle = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    return quizzesGrabbedByFarsiTitle

def grabQuizzesByViews():
    quizzesGrabbedByViews = s.query(Quizzes).order_by(Quizzes.views.desc())
    return quizzesGrabbedByViews

def grabQuizzesByInnerCategory(innerCategory):
    quizzesGrabbedByInnerCategory = s.query(Quizzes).filter(Quizzes.title_eng == innerCategory)
    return quizzesGrabbedByInnerCategory

def grabCategoryByEnglishTitle(title):
    categoryGrabbedByEnglishTitle = s.query(Categories).filter(Categories.title_eng.ilike(f'%{title}%'))
    return categoryGrabbedByEnglishTitle

def grabQuizzesByEnglishTitle(title):
    quizzesGrabbedByEnglishTitle = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{title}%'))
    return quizzesGrabbedByEnglishTitle

def grabQuizQuestionByItsQuestion(quiestion):
    questionGrabbed = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(quiestion))
    return questionGrabbed

def sortNewest():
    newest = grabQuizzesByPublish().limit(5)
    return newest

def newestQuizForNewestPage(fr, to):
    newest = grabQuizzesByPublish().all()[fr:to]
    return newest

def sortMostViews():
    mostViews = grabQuizzesByViews().limit(5)
    return mostViews

def mostViewsQuizForMostViewsPage(fr, to):
    mostViews = grabQuizzesByViews().all()[fr:to]
    return mostViews

def finalPage(howManyElementToShow, whichSortWantToKnowTheFinalPage):
    if whichSortWantToKnowTheFinalPage == 'newest':
        sort = grabQuizzesByPublish().all()
    elif whichSortWantToKnowTheFinalPage == 'mostViews':
        sort = grabQuizzesByViews().all()
    else:
        try:
            category = whichSortWantToKnowTheFinalPage
            sort = grabThisCategory(category).all()
        except:
            innerCategory = whichSortWantToKnowTheFinalPage
            sort = grabQuizzesByInnerCategory(innerCategory).all()

    finalPage = round((len(sort)) / howManyElementToShow)

    if finalPage <= 0:
        finalPage = '1'
        return finalPage
    else:
        str(finalPage)
        return finalPage

def addView(whichShouldAddViewToIt):
    whichShouldAddViewToIt.views += 1

def addViewToQuizzes(title):
    data = grabFirstQuizzesByFarsiTitle(title)
    addView(data)
    add_session(data)

def addViewToCategories(title):
    data = grabCategoryByEnglishTitle(title).first()
    addView(data)
    add_session(data)

def categories(category, fr, to):
    categories = grabThisCategory(category).all()[fr:to]
    return categories

def quizDetail(title):
    quiz_Detail = grabFirstQuizzesByFarsiTitle(title)
    return quiz_Detail

def quizzes_sortByDate():
    quizzesByDate = grabQuizzesByPublish().all()
    return quizzesByDate

def quizzes_FilterByTitle(title):
    quizzesFilterByTitle = grabQuizzesByEnglishTitle(title).all()
    return quizzesFilterByTitle

def quiz_Question(question):
    quiz_Question = grabQuizQuestionByItsQuestion(question).all()
    return quiz_Question

def fanNameOfQuiz(title):
    quiz_Detail = grabFirstQuizzesByFarsiTitle(title)
    fanName = quiz_Detail.fan_name
    return fanName