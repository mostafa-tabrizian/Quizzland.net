import random
from .models import *
from .functions import *

# ------------------Category
def allInnerCategories():
    allCategories = InnerCategories.objects.all()
    return allCategories

def innerCategories(category, fr, to, sortType):
    if sortType == 'newest':
        categories = innerCategoriesByPublish(category).all()[fr:to]
    elif sortType == 'bestest':
        categories = innerCategoryByViews(category).all()[fr:to]
    elif sortType == 'alphabet':
        categories = innerCategoryAlphabet(category).all()[fr:to]
    return categories

def innerCategoriesByPublish(categoryArg):
    category = InnerCategories.objects.filter(category=categoryArg)\
                                      .order_by('-publish')
    return category

def innerCategoryByViews(categoryArg):
    category = InnerCategories.objects.filter(category=categoryArg)\
                                      .order_by('-views')
    return category

def innerCategoryAlphabet(categoryArg):
    category = InnerCategories.objects.filter(category=categoryArg)\
                                  .order_by('innerCategory')
    return category

def innerCategoriesByTitle(title):
    category_contains_eng = InnerCategories.objects.filter(innerCategory=title)
    category_contains_far = InnerCategories.objects.filter(title__contains=title)
    category_icontains_eng = InnerCategories.objects.filter(innerCategory__icontains=title)
    category_icontains_far = InnerCategories.objects.filter(innerCategory__icontains=title)
    category_exact_eng = InnerCategories.objects.filter(innerCategory__exact=title)
    category_exact_far = InnerCategories.objects.filter(innerCategory__exact=title)
    category_iexact_eng = InnerCategories.objects.filter(innerCategory__iexact=title)
    category_iexact_far = InnerCategories.objects.filter(innerCategory__iexact=title)
    category = category_contains_eng | category_contains_far | \
               category_icontains_eng | category_icontains_far | \
               category_exact_eng | category_exact_far | \
               category_iexact_eng | category_iexact_far

    return category

# # ------------------Quizzes
def quizzesByPublish():
    quizzesGrabbedByPublish = Quizzes.objects.order_by('-publish')
    return quizzesGrabbedByPublish

def quizzesPointyByPublish():
    quizzesGrabbedByPublish = Quizzes_Pointy.objects.order_by('-publish')
    return quizzesGrabbedByPublish

def quizzesByViews():
    quizzesGrabbedByPublish = Quizzes.objects.order_by('-views')
    return quizzesGrabbedByPublish

def quizzesPointyByViews():
    quizzesGrabbedByPublish = Quizzes_Pointy.objects.order_by('-views')
    return quizzesGrabbedByPublish

def quizzesByMonthlyViews():
    quizzesGrabbedByPublish = Quizzes.objects.order_by('-monthly_views')
    return quizzesGrabbedByPublish

def quizzesPointyByMonthlyViews():
    quizzesGrabbedByPublish = Quizzes_Pointy.objects.order_by('-monthly_views')
    return quizzesGrabbedByPublish

def quizzesWithInnerCategory(category, innerCategory, fr, to, sortType):
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
    grabbedQuiz = Quizzes.objects.filter(innerCategory=innerCategory)\
                                 .order_by('publish')
    return grabbedQuiz

def quizzesByViewsWithInnerCategory(innerCategory):
    grabbedQuiz = Quizzes.objects.filter(innerCategory=innerCategory)\
                                  .order_by('-views')
    return grabbedQuiz

def quizzesByAlphabetWithInnerCategory(innerCategory):
    grabbedQuiz = Quizzes.objects.filter(innerCategory=innerCategory)\
                                  .order_by('innerCategory')
    return grabbedQuiz

def quizzesByRandomWithInnerCategory(innerCategory):
    # quizzes = Quizzes.objects.filter(innerCategory=innerCategory)
    # countAllQuizzes = len(quizzes.all())
    # randomOffset = random.randint(0, countAllQuizzes - 4)
    grabbedQuiz = Quizzes.objects.filter(innerCategory=innerCategory)[:4]
                                    # .offset(randomOffset)\
    return grabbedQuiz


def quizzesPointyByPublishWithInnerCategory(innerCategory):
    grabbedQuiz = Quizzes_Pointy.objects.filter(innerCategory=innerCategory)\
                                         .order_by('-publish')
    return grabbedQuiz

def quizzesPointyByViewsWithInnerCategory(innerCategory):
    grabbedQuiz = Quizzes_Pointy.objects.filter(innerCategory=innerCategory)\
                                         .order_by('-views')
    return grabbedQuiz

def quizzesPointyByAlphabetWithInnerCategory(innerCategory):
    grabbedQuiz = Quizzes_Pointy.objects.filter(innerCategory=innerCategory)\
                                         .order_by('title')
    return grabbedQuiz

def quizzesByPublishWithCategory(category):
    quizzes = Quizzes.objects.filter(category=category)\
                                  .order_by('-publish')
    return quizzes

def quizzesBothByViewsWithCategory(category):
    if category == 'physiologies':
        grabbedQuiz = Quizzes_Pointy.objects.filter(category=category)\
                                            .order_by('-views')
    else:
        grabbedQuiz = Quizzes.objects.filter(category=category)\
                                    .order_by('-views')
    return grabbedQuiz

def quizzesByMonthlyViewsWithCategory(category):
    grabbedQuiz = Quizzes.objects.filter(category=category)\
                                  .order_by('-monthly_views')
    return grabbedQuiz

def quizzesPointyByPublishWithCategory(category):
    quizzes = Quizzes_Pointy.objects.filter(category=category)\
                                     .order_by('-publish')
    return quizzes

def quizzesPointyByViewsWithCategory(category):
    grabbedQuiz = Quizzes_Pointy.objects.filter(category=category)\
                                         .order_by('-views')
    return grabbedQuiz

def quizzesPointyByMonthlyViewsWithCategory(category):
    grabbedQuiz = Quizzes_Pointy.objects.filter(category=category)\
                                         .order_by('-monthly_views')
    return grabbedQuiz

def sortBothQuizzesByPublishWithCategories(category):
    if category == 'physiologies':
        quizzes = quizzesPointyByPublishWithCategory(category)
    else:
        quizzes = quizzesByPublishWithCategory(category)
    return quizzes

def quizzesByTitle(title):
    quizzes_contains_title = Quizzes.objects.filter(title__contains=title)
    quizzes_icontains_title = Quizzes.objects.filter(title__icontains=title)
    quizzes_exact_title = Quizzes.objects.filter(title__exact=title)
    quizzes_iexact_title = Quizzes.objects.filter(title__iexact=title)
    
    quizzes_contains_title_eng = Quizzes.objects.filter(title_english__contains=title)
    quizzes_icontains_title_eng = Quizzes.objects.filter(title_english__icontains=title)
    quizzes_exact_title_eng = Quizzes.objects.filter(title_english__exact=title)
    quizzes_iexact_title_eng = Quizzes.objects.filter(title_english__iexact=title)

    quizzes_contains_innerCategory = Quizzes.objects.filter(innerCategory=title)
    quizzes_icontains_innerCategory = Quizzes.objects.filter(innerCategory__icontains=title)
    quizzes_exact_innerCategory = Quizzes.objects.filter(innerCategory__exact=title)
    quizzes_iexact_innerCategory = Quizzes.objects.filter(innerCategory__iexact=title)

    quizzes = quizzes_contains_title | quizzes_icontains_title | \
              quizzes_exact_title | quizzes_iexact_title | \
              quizzes_contains_title_eng | quizzes_icontains_title_eng | \
              quizzes_exact_title_eng | quizzes_iexact_title_eng | \
              quizzes_contains_innerCategory | quizzes_icontains_innerCategory | \
              quizzes_exact_innerCategory | quizzes_iexact_innerCategory   

    return quizzes

def quizzesPointyByTitle(title):
    quizzesPointy_contains_title = Quizzes_Pointy.objects.filter(title__contains=title)
    quizzesPointy_icontains_title = Quizzes_Pointy.objects.filter(title__icontains=title)
    quizzesPointy_exact_title = Quizzes_Pointy.objects.filter(title__exact=title)
    quizzesPointy_iexact_title = Quizzes_Pointy.objects.filter(title__iexact=title)
    
    quizzesPointy_contains_title_eng = Quizzes_Pointy.objects.filter(title_english__contains=title)
    quizzesPointy_icontains_title_eng = Quizzes_Pointy.objects.filter(title_english__icontains=title)
    quizzesPointy_exact_title_eng = Quizzes_Pointy.objects.filter(title_english__exact=title)
    quizzesPointy_iexact_title_eng = Quizzes_Pointy.objects.filter(title_english__iexact=title)

    quizzesPointy_contains_innerCategory = Quizzes_Pointy.objects.filter(innerCategory=title)
    quizzesPointy_icontains_innerCategory = Quizzes_Pointy.objects.filter(innerCategory__icontains=title)
    quizzesPointy_exact_innerCategory = Quizzes_Pointy.objects.filter(innerCategory__exact=title)
    quizzesPointy_iexact_innerCategory = Quizzes_Pointy.objects.filter(innerCategory__iexact=title)

    quizzesPointy = quizzesPointy_contains_title | quizzesPointy_icontains_title | \
                    quizzesPointy_exact_title | quizzesPointy_iexact_title | \
                    quizzesPointy_contains_title_eng | quizzesPointy_icontains_title_eng | \
                    quizzesPointy_exact_title_eng | quizzesPointy_iexact_title_eng | \
                    quizzesPointy_contains_innerCategory | quizzesPointy_icontains_innerCategory | \
                    quizzesPointy_exact_innerCategory | quizzesPointy_iexact_innerCategory

    return quizzesPointy

def quizQuestionByTitle(title):
    if Quiz_Questions.objects.filter(title=title).all():
        questions = Quiz_Questions.objects.filter(title=title).all()
    elif Quiz_Pointy_Questions.objects.filter(title=title).all():
        questions = Quiz_Pointy_Questions.objects.filter(title=title).all()
    else:
        print('error in quizQuiestionByTitle')
        return ' '
    
    return questions

# #----------------------------------------------------------------

def addViewToQuizzes(title):
    print('enter')
    try:
        quizToAddView = Quizzes.objects.get(title=title)
        viewsPlusOne(quizToAddView)
    except:
        quiz4OptionToAddView = Quizzes_Pointy.objects.get(title=title)
        viewsPlusOne(quiz4OptionToAddView)


def finalPage(howManyElementToShow, whichTypeWantToKnowTheFinalPage):
    if whichTypeWantToKnowTheFinalPage == 'quizzes':
        sort = quizzesByPublishWithInnerCategory(whichTypeWantToKnowTheFinalPage).all()
    else: # categories
        sort = innerCategoriesByPublish(whichTypeWantToKnowTheFinalPage).all()

    finalPage = round((len(sort)) / howManyElementToShow)

    if finalPage <= 0:
        finalPage = '1'
        return finalPage
    else:
        str(finalPage)
        return finalPage

def fanNameOfQuiz(title):
    quiz_Detail = quizzesByTitle(title)
    fanName = quiz_Detail[0].fan_name
    return fanName

def addViewToCategories(title):
    data = innerCategoriesByEng(title).first()
    viewsPlusOne(data)

def checkIfTheUserExistInNewsletter(emailInput):
    try:
        return Newsletter.objects.get(email=emailInput)
    except:
        return None
