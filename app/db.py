import random
from django.core.cache import cache
from .models import *
from .functions import *

# ------------------Category
def subCategories(category, fr, to, sortType):
    if sortType == 'newest':
        categories = subCategoriesWithCategory(category, '-publish').all()[fr:to]
    elif sortType == 'bestest':
        categories = subCategoriesWithCategory(category, '-views').all()[fr:to]
    elif sortType == 'alphabet':
        categories = subCategoriesWithCategory(category, '-subCategory').all()[fr:to]
    return categories

def subCategoriesWithCategory(categoryArg, sortType):
    category = SubCategories.objects.filter(category=categoryArg)\
                                    .order_by(sortType)
    return category

def subCategoriesByTitle(title):
    category_contains_eng = SubCategories.objects.filter(subCategory=title)
    category_contains_far = SubCategories.objects.filter(title__contains=title)
    category_icontains_eng = SubCategories.objects.filter(subCategory__icontains=title)
    category_icontains_far = SubCategories.objects.filter(subCategory__icontains=title)
    category_exact_eng = SubCategories.objects.filter(subCategory__exact=title)
    category_exact_far = SubCategories.objects.filter(subCategory__exact=title)
    category_iexact_eng = SubCategories.objects.filter(subCategory__iexact=title)
    category_iexact_far = SubCategories.objects.filter(subCategory__iexact=title)

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

def quizzesWithSubCategory_Handler(category, subCategory, fr, to, sortType):
    if category == 'psychology':
        if sortType == 'newest':
            grabbedQuizzes = quizzesWithSubCategory(subCategory, '-publish').all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = quizzesWithSubCategory(subCategory, '-views').all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = quizzesWithSubCategory(subCategory, 'title').all()[fr:to]
    else:
        if sortType == 'newest':
            grabbedQuizzes = quizzesWithSubCategory(subCategory, '-publish').all()[fr:to]
        elif sortType == 'bestest':
            grabbedQuizzes = quizzesWithSubCategory(subCategory, '-views').all()[fr:to]
        elif sortType == 'alphabet':
            grabbedQuizzes = subCategory(subCategory, 'subCategory').all()[fr:to]

    return grabbedQuizzes

def quizzesWithSubCategory(subCategory, sortType):
    grabbedQuiz = Quizzes.objects.filter(subCategory=subCategory)\
                                .order_by(sortType)
    return grabbedQuiz

def quizzesByRandomWithSubCategory(subCategory):
    # quizzes = Quizzes.objects.filter(subCategory=subCategory)
    # countAllQuizzes = len(quizzes.all())
    # randomOffset = random.randint(0, countAllQuizzes - 4)
    grabbedQuiz = Quizzes.objects.filter(subCategory=subCategory)[:4]
                                    # .offset(randomOffset)\
    return grabbedQuiz

def quizzesBothWithCategory(category, sortType):
    if category == 'psychology':
        grabbedQuiz = Quizzes_Pointy.objects.filter(category=category)\
                                            .order_by(sortType)
    else:
        grabbedQuiz = Quizzes.objects.filter(category=category)\
                                    .order_by(sortType)
    return grabbedQuiz

def quizzesByTitle(title):
    quizzes_contains_title = Quizzes.objects.filter(title__contains=title)
    quizzes_icontains_title = Quizzes.objects.filter(title__icontains=title)
    quizzes_exact_title = Quizzes.objects.filter(title__exact=title)
    quizzes_iexact_title = Quizzes.objects.filter(title__iexact=title)

    quizzes_contains_subCategory = Quizzes.objects.filter(subCategory=title)
    quizzes_icontains_subCategory = Quizzes.objects.filter(subCategory__icontains=title)
    quizzes_exact_subCategory = Quizzes.objects.filter(subCategory__exact=title)
    quizzes_iexact_subCategory = Quizzes.objects.filter(subCategory__iexact=title)

    quizzes = quizzes_contains_title | quizzes_icontains_title | \
              quizzes_exact_title | quizzes_iexact_title | \
              quizzes_contains_subCategory | quizzes_icontains_subCategory | \
              quizzes_exact_subCategory | quizzes_iexact_subCategory   

    return quizzes

def quizzesPointyByTitle(title):
    quizzesPointy_contains_title = Quizzes_Pointy.objects.filter(title__contains=title)
    quizzesPointy_icontains_title = Quizzes_Pointy.objects.filter(title__icontains=title)
    quizzesPointy_exact_title = Quizzes_Pointy.objects.filter(title__exact=title)
    quizzesPointy_iexact_title = Quizzes_Pointy.objects.filter(title__iexact=title)

    quizzesPointy_contains_subCategory = Quizzes_Pointy.objects.filter(subCategory=title)
    quizzesPointy_icontains_subCategory = Quizzes_Pointy.objects.filter(subCategory__icontains=title)
    quizzesPointy_exact_subCategory = Quizzes_Pointy.objects.filter(subCategory__exact=title)
    quizzesPointy_iexact_subCategory = Quizzes_Pointy.objects.filter(subCategory__iexact=title)

    quizzesPointy = quizzesPointy_contains_title | quizzesPointy_icontains_title | \
                    quizzesPointy_exact_title | quizzesPointy_iexact_title | \
                    quizzesPointy_contains_subCategory | quizzesPointy_icontains_subCategory | \
                    quizzesPointy_exact_subCategory | quizzesPointy_iexact_subCategory

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
    try:
        quizToAddView = Quizzes.objects.get(title=title)
        viewsPlusOne(quizToAddView)
    except:
        quiz4OptionToAddView = Quizzes_Pointy.objects.get(title=title)
        viewsPlusOne(quiz4OptionToAddView)


def finalPage(howManyElementToShow, whichTypeWantToKnowTheFinalPage):
    if whichTypeWantToKnowTheFinalPage == 'quizzes':
        sort = quizzesWithSubCategory(whichTypeWantToKnowTheFinalPage, '-publish').all()
    else: # categories
        sort = quizzesWithSubCategory(whichTypeWantToKnowTheFinalPage, '-publish').all()

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
    data = subCategoriesByEng(title).first()
    viewsPlusOne(data)