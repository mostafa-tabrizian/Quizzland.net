from crud import *
from sqlalchemy import and_

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

def quizzesByViews():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.views.desc())
    return quizzesGrabbedByPublish

def quizzes(category, innerCategory, fr, to, sortType):
    if category == 'physiologies':
        if sortType == 'newest':
            grabbedQuizzes = quizzes4OptionByPublishWithInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = quizzes4OptionByViewsWithInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = quizzes4OptionByAlphabetWithInnerCategory(innerCategory).all()[fr:to]
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

def quizzes4OptionByPublishWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(Quizzes4Option.publish.desc())
    return grabbedQuiz

def quizzes4OptionByViewsWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(Quizzes4Option.views.desc())
    return grabbedQuiz

def quizzes4OptionByAlphabetWithInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(Quizzes4Option.title_far.asc())
    return grabbedQuiz

def quizzesByPublishWithCategory(category):
    quizzes = s.query(Quizzes).filter(Quizzes.Category.ilike(f'%{category}%'))\
                                  .order_by(Quizzes.publish.desc())
    return quizzes

def quizzesByViewsWithCategory(category):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.Category.ilike(f'%{category}%'))\
                                  .order_by(Quizzes.views.desc())
    return grabbedQuiz

def quizzes4OptionByPublishWithCategory(category):
    quizzes = s.query(Quizzes4Option).filter(Quizzes4Option.category.ilike(f'%{category}%'))\
                                     .order_by(Quizzes4Option.publish.desc())
    return quizzes

def quizzes4OptionByViewsWithCategory(category):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.category.ilike(f'%{category}%'))\
                                         .order_by(Quizzes4Option.views.desc())
    return grabbedQuiz

def sortBothQuizzesByPublishWithCategories(category):
    if category == 'physiologies':
        quizzes = quizzes4OptionByPublishWithCategory(category)
    else:
        quizzes = quizzesByPublishWithCategory(category)
    return quizzes

def quizzesWithTitle(title):
    quizzes = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%'))
    return quizzes

def quizzes4OptionWithTitle(title):
    quizzes4Option = s.query(Quizzes4Option).filter(Quizzes4Option.title_far.ilike(f'%{title}%'))
    return quizzes4Option

def firstQuizByFarsiTitle(title):
    quizzes = quizzesWithTitle(title).first()
    quizzes4Option = quizzes4OptionWithTitle(title).first()

    if checkIfNotNoneTypeOrNone(quizzes):
        data = quizzes
    elif checkIfNotNoneTypeOrNone(quizzes4Option):
        data = quizzes4Option
    return data

def quizQuestion(category, titleFar):
    if category == 'physiologies':
        questions = s.query(fourOptionQuizQuestions).filter(fourOptionQuizQuestions.title_far.ilike(titleFar)).all()
    else:
        questions = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(titleFar)).all()
    return questions

def fanNameOfQuiz(title):
    quiz_Detail = firstQuizByFarsiTitle(title)
    fanName = quiz_Detail.fan_name
    return fanName

# ------------------Others

def addView(whichShouldAddViewToIt):
    whichShouldAddViewToIt.views += 1

def addViewToCategories(title):
    data = categoriesByTitleEng(title).first()
    
    addView(data)
    add_session(data)

def addViewToQuizzes(title):
    quizToAddView = quizzesWithTitle(title).first()
    quiz4OptionToAddView = quizzes4OptionWithTitle(title).first()

    if checkIfNotNoneTypeOrNone(quizToAddView):
        data = quizToAddView
    elif checkIfNotNoneTypeOrNone(quiz4OptionToAddView):
        data = quiz4OptionToAddView

    addView(data)
    add_session(data)

def checkIfNotNoneTypeOrNone(data):
    return data != 'NoneType' and data is not None

def finalPage(howManyElementToShow, whichTypeWantToKnowTheFinalPage):
    if whichTypeWantToKnowTheFinalPage == 'quizzes':
        sort = allQuizzes()
    else: # categories
        sort = allCategories()

    finalPage = round((len(sort)) / howManyElementToShow)

    if finalPage <= 0:
        finalPage = '1'
        return finalPage
    else:
        str(finalPage)
        return finalPage