import random
from django.core.cache import cache
from .models import *
from .functions import *

# ------------------Category
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
    if cache.get('quizzesByPublish'):
        quizzesGrabbedByPublish = cache.get('quizzesByPublish')
    else:
        quizzesGrabbedByPublish = Quizzes.objects.order_by('-publish')
        cache.set('quizzesByPublish', quizzesGrabbedByPublish)
    return quizzesGrabbedByPublish

def quizzesPointyByPublish():
    if cache.get('quizzesPointyByPublish'):
        quizzesGrabbedByPublish = cache.get('quizzesPointyByPublish')
    else:
        quizzesGrabbedByPublish = Quizzes_Pointy.objects.order_by('-publish')
        cache.set('quizzesPointyByPublish', quizzesGrabbedByPublish)
    return quizzesGrabbedByPublish

def quizzesByViews():
    if cache.get('quizzesByViews'):
        quizzesGrabbedByPublish = cache.get('quizzesByViews')
    else:
        quizzesGrabbedByPublish = Quizzes.objects.order_by('-views')
        cache.set('quizzesByViews', quizzesGrabbedByPublish)
    return quizzesGrabbedByPublish

def quizzesPointyByViews():
    if cache.get('quizzesPointyByViews'):
        quizzesGrabbedByPublish = cache.get('quizzesPointyByViews')
    else:
        quizzesGrabbedByPublish = Quizzes_Pointy.objects.order_by('-views')
        cache.set('quizzesPointyByViews', quizzesGrabbedByPublish)
    return quizzesGrabbedByPublish

def quizzesByMonthlyViews():
    if cache.get('quizzesByMonthlyViews'):
        quizzesGrabbedByPublish = cache.get('quizzesByMonthlyViews')
    else:
        quizzesGrabbedByPublish = Quizzes.objects.order_by('-monthly_views')
        cache.set('quizzesByMonthlyViews', quizzesGrabbedByPublish)
    return quizzesGrabbedByPublish

def quizzesPointyByMonthlyViews():
    if cache.get('quizzesPointyByMonthlyViews'):
        quizzesGrabbedByPublish = cache.get('quizzesPointyByMonthlyViews')
    else:
        quizzesGrabbedByPublish = Quizzes_Pointy.objects.order_by('-monthly_views')
        cache.set('quizzesPointyByMonthlyViews', quizzesGrabbedByPublish)
    return quizzesGrabbedByPublish

def quizzesWithInnerCategory(category, innerCategory, fr, to, sortType):
    if category == 'Physiologies':
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
    if category == 'Physiologies':
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
    if category == 'Physiologies':
        quizzes = quizzesPointyByPublishWithCategory(category)
    else:
        quizzes = quizzesByPublishWithCategory(category)
    return quizzes

def quizzesByTitle(title):
    quizzes_contains_title = Quizzes.objects.filter(title__contains=title)
    quizzes_icontains_title = Quizzes.objects.filter(title__icontains=title)
    quizzes_exact_title = Quizzes.objects.filter(title__exact=title)
    quizzes_iexact_title = Quizzes.objects.filter(title__iexact=title)

    quizzes_contains_innerCategory = Quizzes.objects.filter(innerCategory=title)
    quizzes_icontains_innerCategory = Quizzes.objects.filter(innerCategory__icontains=title)
    quizzes_exact_innerCategory = Quizzes.objects.filter(innerCategory__exact=title)
    quizzes_iexact_innerCategory = Quizzes.objects.filter(innerCategory__iexact=title)

    quizzes = quizzes_contains_title | quizzes_icontains_title | \
              quizzes_exact_title | quizzes_iexact_title | \
              quizzes_contains_innerCategory | quizzes_icontains_innerCategory | \
              quizzes_exact_innerCategory | quizzes_iexact_innerCategory   

    return quizzes

def quizzesPointyByTitle(title):
    quizzesPointy_contains_title = Quizzes_Pointy.objects.filter(title__contains=title)
    quizzesPointy_icontains_title = Quizzes_Pointy.objects.filter(title__icontains=title)
    quizzesPointy_exact_title = Quizzes_Pointy.objects.filter(title__exact=title)
    quizzesPointy_iexact_title = Quizzes_Pointy.objects.filter(title__iexact=title)

    quizzesPointy_contains_innerCategory = Quizzes_Pointy.objects.filter(innerCategory=title)
    quizzesPointy_icontains_innerCategory = Quizzes_Pointy.objects.filter(innerCategory__icontains=title)
    quizzesPointy_exact_innerCategory = Quizzes_Pointy.objects.filter(innerCategory__exact=title)
    quizzesPointy_iexact_innerCategory = Quizzes_Pointy.objects.filter(innerCategory__iexact=title)

    quizzesPointy = quizzesPointy_contains_title | quizzesPointy_icontains_title | \
                    quizzesPointy_exact_title | quizzesPointy_iexact_title | \
                    quizzesPointy_contains_innerCategory | quizzesPointy_icontains_innerCategory | \
                    quizzesPointy_exact_innerCategory | quizzesPointy_iexact_innerCategory

    return quizzesPointy

def quizQuestionByTitle(title):
    if Questions.objects.filter(title=title).all():
        questions = Questions.objects.filter(title=title).all()
        
    elif Pointy_Questions.objects.filter(title=title).all():
        questions = Pointy_Questions.objects.filter(title=title).all()
    else:
        return ' '
    
    return questions

# #----------------------------------------------------------------

def addViewToQuizzes(title):
    print(title)
    print('ADD TO QUIZ VIEW')
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