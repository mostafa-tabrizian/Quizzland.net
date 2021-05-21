from crud import *
from sqlalchemy import and_

# ------------------Category
def categories(category, fr, to, sortType):
    if sortType == 'newest':
        categories = newestCategories(category).all()[fr:to]
    elif sortType == 'bestest':
        categories = bestestCategory(category).all()[fr:to]
    elif sortType == 'alphabet':
        categories = alphabetCategory(category).all()[fr:to]
    return categories

def newestCategories(category):
    category = s.query(Categories).filter(Categories.category == category)\
                                  .order_by(Categories.publish.desc())
    return category

def bestestCategory(category):
    category = s.query(Categories).filter(Categories.category == category)\
        .order_by(Categories.views.desc())
    return category

def alphabetCategory(category):
    category = s.query(Categories).filter(Categories.category == category)\
                                  .order_by(Categories.title_eng.asc())
    return category

def allCategories():
    allCategories = s.query(Categories).all()
    return allCategories

def categoriesByPublish():
    categoryGrabbedByPublish = s.query(Categories).order_by(Categories.publish.desc())
    return categoryGrabbedByPublish

def categoriesByViews():
    quizzesGrabbedByPublish = s.query(Categories).order_by(Categories.views.desc())
    return quizzesGrabbedByPublish

# ------------------Quizzes
def quizzes(category, innerCategory, fr, to, sortType):
    if category == 'physiologies':
        if sortType == 'newest':
            grabbedQuizzes = newestQuizzes4OptionByInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = bestestQuizzes4OptionByInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = alphabetQuizzes4OptionByInnerCategory(innerCategory).all()[fr:to]
    else:
        if sortType == 'newest':
            grabbedQuizzes = newestQuizzesByInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = bestestQuizzesByInnerCategory(innerCategory).all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = alphabetQuizzesByInnerCategory(innerCategory).all()[fr:to]

    return grabbedQuizzes

def newestQuizzesByCategory__paged(Category, fr, to):
    if Category == 'physiologies':
        grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.category.ilike(f'%{Category}%'))\
                                .order_by(Quizzes4Option.publish.desc()).all()[fr:to]
    else:
        grabbedQuiz = s.query(Quizzes).filter(Quizzes.Category.ilike(f'%{Category}%'))\
                                    .order_by(Quizzes.publish.desc()).all()[fr:to]
    return grabbedQuiz

def newestQuizzesByCategory__limited(Category):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.Category.ilike(f'%{Category}%'))\
                                  .order_by(Quizzes.publish.desc())\
                                  .limit(15)
    return grabbedQuiz

def newestQuizzesByInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                  .order_by(Quizzes.publish.desc())
    return grabbedQuiz


def bestestQuizzesByCategory__paged(category, fr, to):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.Category.ilike(f'%{category}%'))\
                                  .order_by(Quizzes.views.desc())[fr:to]
    return grabbedQuiz

def bestestQuizzesByCategory__limited(category):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.Category.ilike(f'%{category}%'))\
                                  .order_by(Quizzes.views.desc())\
                                  .limit(5)
    return grabbedQuiz

def bestestQuizzesByInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                  .order_by(Quizzes.views.desc())
    return grabbedQuiz

def alphabetQuizzesByInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes).filter(Quizzes.innerCategory.ilike(f'%{innerCategory}%'))\
                                  .order_by(Quizzes.innerCategory.asc())
    return grabbedQuiz

def newestQuizzes4OptionByInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{innerCategory}%'))
    return grabbedQuiz

def newestQuizzes4OptionByCategory__limited(Category):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.category.ilike(f'%{Category}%'))\
                                         .limit(15)
    return grabbedQuiz

def bestestQuizzes4OptionByCategory__limited(Category):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.category.ilike(f'%{Category}%'))\
                                         .order_by(Quizzes4Option.views.desc())\
                                         .limit(5)
    return grabbedQuiz

def bestestQuizzes4OptionByInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(Quizzes4Option.views.desc())
    return grabbedQuiz

def alphabetQuizzes4OptionByInnerCategory(innerCategory):
    grabbedQuiz = s.query(Quizzes4Option).filter(Quizzes4Option.innerCategory.ilike(f'%{innerCategory}%'))\
                                         .order_by(Quizzes4Option.title_far.asc())
    return grabbedQuiz

def firstQuizByFarsiTitle(title):
    quizzesGrabbedByFarsiTitle = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{title}%')).first()
    quizzes4OptionGrabbedByFarsiTitle = s.query(Quizzes4Option).filter(Quizzes4Option.title_far.ilike(f'%{title}%')).first()

    if checkIfNotNoneTypeOrNone(quizzesGrabbedByFarsiTitle):
        data = quizzesGrabbedByFarsiTitle
    elif checkIfNotNoneTypeOrNone(quizzes4OptionGrabbedByFarsiTitle):
        data = quizzes4OptionGrabbedByFarsiTitle
    return data

def quizQuestion(titleFar):
    questionGrabbed = s.query(quizQuestions).filter(quizQuestions.title_far.ilike(titleFar)).all()\
        + s.query(fourOptionQuizQuestions).filter(fourOptionQuizQuestions.title_far.ilike(titleFar)).all()
    return questionGrabbed

def allQuizzes():
    allQuizzes =  s.query(Quizzes).all()
    return allQuizzes

def allQuizzesByPublish():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.publish.desc())
    return quizzesGrabbedByPublish

def QuizzesForNewest__paged(fr, to):
    QuizzesForNewest__paged = allQuizzesByPublish().all()[fr:to]
    return QuizzesForNewest__paged

def QuizzesByViews():
    quizzesGrabbedByPublish = s.query(Quizzes).order_by(Quizzes.views.desc())
    return quizzesGrabbedByPublish

def quizzesByViews__limited():
    limitedQuizzesGrabbedByViews = QuizzesByViews().limit(5)
    return limitedQuizzesGrabbedByViews

def quizzesForMostViews__paged(fr, to):
    QuizzesForNewest__paged = QuizzesByViews().all()[fr:to]
    return QuizzesForNewest__paged

def fanNameOfQuiz(title):
    quiz_Detail = firstQuizByFarsiTitle(title)
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