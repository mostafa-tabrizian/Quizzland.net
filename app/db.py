from crud import *
from funcs import *
import random

# ------------------Category
def allCategories():
    allCategories = s.query(Categories).all()
    return allCategories

def categories(category, fr, to, sortType):
    if sortType == 'newest':
        categories = categoriesByPublish(category).all()[fr:to]
    elif sortType == 'bestest':
        categories = categoryByViews(category).all()[fr:to]
    elif sortType == 'alphabet':
        categories = categoryAlphabet(category).all()[fr:to]
    return categories

def categoriesByPublish(category):
    category = s.query(Categories).filter(Categories.category == category)\
                                  .order_by(Categories.publish.desc())
    return category

def categoryByViews(category):
    category = s.query(Categories).filter(Categories.category == category)\
        .order_by(Categories.views.desc())
    return category

def categoryAlphabet(category):
    category = s.query(Categories).filter(Categories.category == category)\
                                  .order_by(Categories.title_eng.asc())
    return category

def categoriesByTitleFar(title):
    category = s.query(Categories).filter(Categories.title_far.ilike(f'%{title}%'))
    return category

def categoriesByTitleEng(title):
    category = s.query(Categories).filter(Categories.title_eng.ilike(f'%{title}%'))
    return category

# ------------------Quizzes
def allQuizzes():
    quizzes =  s.query(Quizzes).all()
    return quizzes

def quizzesByPublish():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.publish.desc())
    return quizzesGrabbedByPublish

def quizzesPointyByPublish():
    quizzesGrabbedByPublish = s.query(QuizzesPointy).order_by(QuizzesPointy.publish.desc())
    return quizzesGrabbedByPublish

def quizzesByViews():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.views.desc())
    return quizzesGrabbedByPublish

def quizzesPointyByViews():
    quizzesGrabbedByPublish = s.query(QuizzesPointy).order_by(QuizzesPointy.views.desc())
    return quizzesGrabbedByPublish

def quizzesByMonthlyViews():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.monthly_views.desc())
    return quizzesGrabbedByPublish

def quizzesPointyByMonthlyViews():
    quizzesGrabbedByPublish = s.query(QuizzesPointy).order_by(QuizzesPointy.monthly_views.desc())
    return quizzesGrabbedByPublish

def quizzes(category, innerCategory, fr, to, sortType):
    if category == 'physiologies':
        if sortType == 'newest':
            grabbedQuizzes = quizzesPointyByPublishWithInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = quizzesPointyByViewsWithInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = quizzesPointyByAlphabetWithInnerCategory(innerCategory).all()[fr:to]
    else:
        if sortType == 'newest':
            grabbedQuizzes = quizzesByPublishWithInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = quizzesByViewsWithInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = quizzesByAlphabetWithInnerCategory(innerCategory).all()[fr:to]

    return grabbedQuizzes

def quizzesByPublishWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                  .order_by(Quizzes.publish.desc())
    return grabbedQuiz

def quizzesByViewsWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                  .order_by(Quizzes.views.desc())
    return grabbedQuiz

def quizzesByAlphabetWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                  .order_by(Quizzes.innerCategory.asc())
    return grabbedQuiz

def quizzesByRandomWithInnerCategory(innerCategory):
    # quizzes = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))
    # countAllQuizzes = len(quizzes.all())
    # randomOffset = random.randint(0, countAllQuizzes - 4)
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                    .limit(4)
                                    # .offset(randomOffset)\
    return grabbedQuiz


def quizzesPointyByPublishWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(QuizzesPointy).filter(QuizzesPointy.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(QuizzesPointy.publish.desc())
    return grabbedQuiz

def quizzesPointyByViewsWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(QuizzesPointy).filter(QuizzesPointy.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(QuizzesPointy.views.desc())
    return grabbedQuiz

def quizzesPointyByAlphabetWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(QuizzesPointy).filter(QuizzesPointy.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(QuizzesPointy.title_far.asc())
    return grabbedQuiz

def quizzesByPublishWithCategory(category):
    quizzes = s.query(Quizzes).filter(Quizzes.category.ilike(f'%{category}%'))\
                                  .order_by(Quizzes.publish.desc())
    return quizzes

def quizzesBothByViewsWithCategory(category):
    if category == 'physiologies':
        grabbedQuiz = s.query(QuizzesPointy).filter(QuizzesPointy.category.ilike(f'%{category}%'))\
                                            .order_by(QuizzesPointy.views.desc())
    else:
        grabbedQuiz = s.query(Quizzes).filter(Quizzes.category.ilike(f'%{category}%'))\
                                    .order_by(Quizzes.views.desc())
    return grabbedQuiz

def quizzesByMonthlyViewsWithCategory(category):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.category.ilike(f'%{category}%'))\
                                  .order_by(Quizzes.monthly_views.desc())
    return grabbedQuiz

def quizzesPointyByPublishWithCategory(category):
    quizzes = s.query(QuizzesPointy).filter(QuizzesPointy.category.ilike(f'%{category}%'))\
                                     .order_by(QuizzesPointy.publish.desc())
    return quizzes

def quizzesPointyByViewsWithCategory(category):
    grabbedQuiz = s.query(QuizzesPointy).filter(QuizzesPointy.category.ilike(f'%{category}%'))\
                                         .order_by(QuizzesPointy.views.desc())
    return grabbedQuiz

def quizzesPointyByMonthlyViewsWithCategory(category):
    grabbedQuiz = s.query(QuizzesPointy).filter(QuizzesPointy.category.ilike(f'%{category}%'))\
                                         .order_by(QuizzesPointy.monthly_views.desc())
    return grabbedQuiz

def sortBothQuizzesByPublishWithCategories(category):
    if category == 'physiologies':
        quizzes = quizzesPointyByPublishWithCategory(category)
    else:
        quizzes = quizzesByPublishWithCategory(category)
    return quizzes

def quizzesWithTitle(title):
    quizzes = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%'))
    return quizzes

def quizzesPointyWithTitle(title):
    quizzesPointy = s.query(QuizzesPointy).filter(QuizzesPointy.title_far.ilike(f'%{title}%'))
    return quizzesPointy

def firstQuizByFarsiTitle(title):
    quizzes = quizzesWithTitle(title).first()
    quizzesPointy = quizzesPointyWithTitle(title).first()

    if checkIfNotNoneTypeOrNone(quizzes):
        data = quizzes
    elif checkIfNotNoneTypeOrNone(quizzesPointy):
        data = quizzesPointy
    return data

def quizQuestion(category, titleFar):
    if category == 'physiologies':
        questions = s.query(quizPointyQuestions).filter(quizPointyQuestions.title_far.ilike(titleFar)).all()
    else:
        questions = s.query(quizPollQuestions).filter(quizPollQuestions.title.ilike(titleFar)).all()\
                    + s.query(quizQuestions).filter(quizQuestions.title_far.ilike(titleFar)).all()
    
    return questions

#----------------------------------------------------------------
def addViewToQuizzes(title):
    quizToAddView = quizzesWithTitle(title).first()
    quiz4OptionToAddView = quizzesPointyWithTitle(title).first()

    if checkIfNotNoneTypeOrNone(quizToAddView):
        data = quizToAddView
    elif checkIfNotNoneTypeOrNone(quiz4OptionToAddView):
        data = quiz4OptionToAddView

    addView(data)
    add_session(data)


def finalPage(howManyElementToShow, whichTypeWantToKnowTheFinalPage):
    if whichTypeWantToKnowTheFinalPage == 'quizzes':
        sort = quizzesByPublishWithInnerCategory(whichTypeWantToKnowTheFinalPage).all()
    else: # categories
        sort = categoriesByPublish(whichTypeWantToKnowTheFinalPage).all()

    finalPage = round((len(sort)) / howManyElementToShow)

    if finalPage <= 0:
        finalPage = '1'
        return finalPage
    else:
        str(finalPage)
        return finalPage

def fanNameOfQuiz(title):
    quiz_Detail = firstQuizByFarsiTitle(title)
    fanName = quiz_Detail.fan_name
    return fanName

def addViewToCategories(title):
    data = categoriesByTitleEng(title).first()
    addView(data)
    add_session(data)


def checkIfNotNoneTypeOrNone(data):
    return data != 'NoneType' and data is not None
