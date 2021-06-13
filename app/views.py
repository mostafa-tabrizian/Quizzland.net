from django import template
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, reverse, redirect
from django.template import loader, RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.views.decorators.cache import cache_page
from .models import *
from .blocks import *
from .functions import *
from .db import *
from .forms import *

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)
register = template.Library()

@cache_page(CACHE_TTL)
def index(request):

    template = loader.get_template('app/index.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'colorOfHeader': 'header__white',
        'headTitle': 'QuizLand | کوئیزلند بزرگترین وب‌سایت کوئيز',
        'description': 'کوئیزلند بزرگترین وب‌ سایت کوئيز برای کتگوری و گروه های متنوع همچون کوئیز های سلبریتی ها, کوئيز های فیلم و سریال, کوئیز های گیمینگ و تست های روانشناسی معتبر از سایت های رسمی. باحال ترین کوئيز ها رو اینجا پیدا میکنید',
        'keywords': 'کوئیز, کوئیز های فیلم و سریال, کوئیز های سلبریتی و آدم های معروف, خواننده, بازیگر, کوئیز های گیمینگ, تست های روانشناسی معتبر, کوئیز های باحال, کوئيز های فان, بهترین وب سایت کوئيز, بهترین وب سایت تست',

        'bestestQuizzes': quizzesByViews()[:5],
        'bestestQuizzesForThisMonth': quizzesByMonthlyViews()[:5],

        'NewestCelebrityQuizSection':  quizzesByPublishWithCategory('celebrity')[:4],
        'BestestCelebrityQuizSection': quizzesBothByViewsWithCategory('celebrity')[:13],
        'MonthlyBestestCelebrityQuizSection': quizzesByMonthlyViewsWithCategory('celebrity')[:13],

        'NewestMovieSeriesQuizSection':  quizzesByPublishWithCategory('movie-series')[:4],
        'BestestMovieSeriesQuizSection': quizzesBothByViewsWithCategory('movie-series')[:13],
        'MonthlyBestestMovieSeriesQuizSection': quizzesByMonthlyViewsWithCategory('movie-series')[:13],
        
        'NewestGamingQuizSection':  quizzesByPublishWithCategory('gaming')[:4],
        'BestestGamingQuizSection': quizzesBothByViewsWithCategory('gaming')[:13],
        'MonthlyBestestGamingQuizSection': quizzesByMonthlyViewsWithCategory('gaming')[:13],
        
        'NewestPhysiologiesQuizSection':  quizzesPointyByPublishWithCategory('physiology')[:4],
        'BestestPhysiologiesQuizSection': quizzesPointyByViewsWithCategory('physiology')[:13],
        'MonthlyBestestPhysiologiesQuizSection': quizzesPointyByMonthlyViewsWithCategory('physiology')[:10]
    }

    return HttpResponse(template.render(context))

# def validSearch(request):
#     searchTarget = request.GET.get('searchTarget')
#     data = {
#         'searchTarget': searchTarget
#     }
#     return JsonResponse(data)


@csrf_exempt
def search(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            searchInput = form.cleaned_data['searchInput']
            template = loader.get_template('app/search.html')
            context = {
                'searchForm': SearchForm(),
                'newsletterForm': NewsletterForm(),
                'headTitle': f'QuizLand | {searchInput} جستجو عبارت ',
                'userSearchInput': searchInput,
                'innerCategoriesByTitle': innerCategoriesByTitle(searchInput)[:2],
                'quizzesByTitle': quizzesByTitle(searchInput)[:8],
                'quizzesPointyByTitle': quizzesPointyByTitle(searchInput)[:8],
            }

            return HttpResponse(template.render(context))

def searchMore(request, target):
    template = loader.get_template('app/moreSearchResult.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | {target} جستجو عبارت ',
        'userSearchInput': target,
        'innerCategoriesByTitle': innerCategoriesByTitle(target)[:2],
        'quizzesByTitle': quizzesByTitle(target)[:28],
        'quizzesPointyByTitle': quizzesPointyByTitle(target)[:28],
    }

    return HttpResponse(template.render(context))

@cache_page(CACHE_TTL)
def category(request, categoryArg, page, sortType, numberOfResult ):
    if numberOfResult == '16' or numberOfResult == '32' or numberOfResult == '48':
        howManyElementToShow = int(numberOfResult)
        fTPage = frToPage(page, howManyElementToShow)
        template = loader.get_template('app/category.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'headTitle': f'QuizLand | کوئیز های {categoryInFar[categoryArg]} ',
            'description': 'کتگوری و گروه های متنوع همچون آدم های معروف و سلبریتی, خواننده, بازیگر, فیلم و سریال, گیمینگ و تست های روانشناسی',
            'keywords': 'تست های روانشناسی, سلبریتی, خواننده, بازیگر, فیلم و سریال, گیمینگ,آدم های معروف, کوئيز',
            'tools': tools,
            'category': categoryArg,
            'categories': innerCategories(categoryArg, fTPage[0], fTPage[1], sortType),
            'pageTravel': pageTravel(finalPage(howManyElementToShow, categoryArg)),
        }
        return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual(request)

@cache_page(CACHE_TTL)
def innerCategory(request, category, innerCategory, page, sortType, numberOfResult):
    if numberOfResult == '16' or numberOfResult == '32' or numberOfResult == '48':
        howManyElementToShow = int(numberOfResult)
        fTPage = frToPage(page, howManyElementToShow)
        InnerCategory = titleConverterFromUrlToNormalOne(innerCategory)
        # addViewToCategories(InnerCategory)
        template = loader.get_template('app/innerCategory.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'headTitle': f'QuizLand | {innerCategory} ',
            'description': f'کوئيزلند {innerCategory} کوئيز های',
            'keywords': f'{innerCategory} بهترین کوئيز های , {innerCategory} کوئيز های',
            'colorOfHeader': 'header__white',
            'tools': tools,
            'innerCategory': innerCategoriesByTitle(InnerCategory)[0].background,
            'quizzes': quizzesWithInnerCategory(category, InnerCategory, fTPage[0], fTPage[1], sortType),
            'pageTravel': pageTravel(finalPage(howManyElementToShow, InnerCategory)),
        }
        return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual(request)

def quiz(request, category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    template = loader.get_template('app/quiz.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | {title} ', 
        'description': f'کوئيز {fullTitle} ',
        'keywords': f'{fullTitle}, {innerCategory}, کوئیز های ',
        'colorOfHeader': 'header__white',
        'quizDetail': quizzesByTitle(fullTitle)[0],
        'quiz_Question': quizQuestionByTitle(fullTitle),
    }
    return HttpResponse(template.render(context))

def quizPointy(request, category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    template = loader.get_template('app/quizPointy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | {title}',
        'description': f'کوئيز {fullTitle} ',
        'keywords': f'{fullTitle}, {innerCategory}, کوئیز های ',
        'colorOfHeader': 'header__white',
        'quizDetail': quizzesPointyByTitle(fullTitle)[0],
        'quiz_Question': quizQuestionByTitle(fullTitle),
    }
    return HttpResponse(template.render(context))

def result(request, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    innerCategory = titleConverterFromUrlToNormalOne(innerCategory)
    template = loader.get_template('app/result.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'suggestingQuiz': quizzesByRandomWithInnerCategory(innerCategory),
        'quizDetail': quizzesByTitle(fullTitle)[0],
        'fanName': fanNameOfQuiz(fullTitle),
        'fullTitle': fullTitle,
        'backBtn': backBtn,
        'headTitle': f'QuizLand | نتیجه کوئیز ',  
    }
    return HttpResponse(template.render(context))

def resultPointy(request, title, score):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    template = loader.get_template('app/resultPointy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'fullTitle': fullTitle,
        'quizDetail': quizzesPointyByTitle(fullTitle)[0],
        'backBtn': backBtn,
        'score': abs(int(score)),
        'headTitle': f'QuizLand | نتیجه تست ',  
    }
    return HttpResponse(template.render(context))

@cache_page(CACHE_TTL)
def sortTheQuizzes(request, sortOfQuiz, page):
    howManyElementToShow = 12
    fTPage = frToPage(page, howManyElementToShow)

    if (sortOfQuiz == 'newest'):
        sort = quizzesByPublish().all()[fTPage[0]:fTPage[1]]
        sortPointy = quizzesPointyByPublish().all()[fTPage[0]:fTPage[1]]
        title = "جدیدترین کوئیز ها"
        titlePointy = "جدیدترین تست ها"
    elif (sortOfQuiz == 'bestest'):
        sort = quizzesByViews().all()[fTPage[0]:fTPage[1]]
        sortPointy = quizzesPointyByViews().all()[fTPage[0]:fTPage[1]]
        title = "پربازدیدترین کوئيز ها"
        titlePointy = "پربازدیدترین تست ها"
    elif sortOfQuiz == 'monthlyBestest':
        sort = quizzesByMonthlyViews()[fTPage[0]:fTPage[1]]
        sortPointy = quizzesPointyByMonthlyViews().all()[fTPage[0]:fTPage[1]]
        title = "پر بازدیدترین کوئیز های این ماه"
        titlePointy = "پر بازدیدترین تست های این ماه"

    template = loader.get_template('app/sort.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'quizPage': 'quiz',
        'pageTravel': pageTravel(finalPage(howManyElementToShow, 'quizzes')),
        'sort': sort,
        'sortPointy': sortPointy,
        'title': title,
        'titlePointy': titlePointy,
        'headTitle': f'QuizLand | {title}'
    }
    return HttpResponse(template.render(context))

@cache_page(CACHE_TTL)
def sortTheQuizzesByCategory(request, category, page, sortOfQuiz):
    howManyElementToShow = 12
    fTPage = frToPage(page, howManyElementToShow)

    if sortOfQuiz == 'newest':
        sort = sortBothQuizzesByPublishWithCategories(category).all()[fTPage[0]:fTPage[1]]
        title = "جدیدترین کوئیز های"
    elif sortOfQuiz == 'bestest':
        sort = quizzesBothByViewsWithCategory(category)[fTPage[0]:fTPage[1]]
        title = "پر بازدیدترین کوئیز های"

    if category == 'physiology':
        quizPage = 'quizPointy'
    else:
        quizPage = 'quiz'

    template = loader.get_template('app/sort.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'quizPage': quizPage,
        'hideSecondColumn': 'noVis',
        'categoryStyle': 'sortMore__categoryStyle wrapper-med',
        'sort': sort,
        'title': title,
        'category': categoryInFar[category],
        'pageTravel': pageTravel(finalPage(howManyElementToShow, 'quizzes')),
        'headTitle': f'QuizLand | {title} {categoryInFar[category]} '
    }
    return HttpResponse(template.render(context))

def contact(request):
    template = loader.get_template('app/contact.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'description': 'تماس با پشتیبانی کوئيزلند',
        'keywords': 'پشتیبانی کوئيزلند',
        'headTitle': f'QuizLand | تماس با ما ',
        'backBtn': backBtn,
    }
    return HttpResponse(template.render(context))

def privacyPolicy(request):
    template = loader.get_template('app/privacyPolicy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'backBtn': backBtn,
        'headTitle': 'QuizLand | حریم خصوصی '
    }
    return HttpResponse(template.render(context))

def guide(request):
    template = loader.get_template('app/guide.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | راهنما ',
        'description': 'راهنمای وب سایت کوئيزلند',
        'keywords': 'کوئيزلند, راهنمای وب سایت کوئيزلند',
        'backBtn': backBtn,
    }
    return HttpResponse(template.render(context))

def adverts(request):
    template = loader.get_template('app/adverts.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'backBtn': backBtn,
        'headTitle': f'QuizLand | تبلیغات '
    }
    return HttpResponse(template.render(context))

def support(request):
    template = loader.get_template('app/support.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'backBtn': backBtn,
        'headTitle': f'QuizLand | حمایت '
    }
    return HttpResponse(template.render(context))

def doesExistInNewsletterUsers(request):
    userEmail = request.GET.get('userEmail')
    data = {
        'userEmail': Newsletter_Users.objects.filter(email__iexact=userEmail).exists()
    }
    return JsonResponse(data)

@csrf_exempt
def newsletter(request):
    print('newsletter views')

    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            emailInput = form.cleaned_data['emailInput']
            usernameInput = form.cleaned_data['usernameInput']
            favoriteCategory = form.cleaned_data['favoriteCategory']

            Newsletter_Users.objects.create(
                email= emailInput,
                username= usernameInput,
                favorite_Category= favoriteCategory
            )
            
            return redirect('/')
        
    else:
        return pageNotFoundManual(request)

def pageNotFoundManual(request):
    template = loader.get_template('app/errorHandler.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'backBtn': backBtn,
        'headTitle': f'QuizLand | صفحه مورد نظر پیدا نشد ', 
        'message': "🤔 صفحه‌ی مورد نظر پیدا نشد",
    }
    return HttpResponse(template.render(context))

def error404(request, exception):
    template = loader.get_template('app/errorHandler.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'backBtn': backBtn,
        'headTitle': f'QuizLand | صفحه مورد نظر پیدا نشد ', 
        'message': "🤔 صفحه‌ی مورد نظر پیدا نشد"
    }
    return HttpResponse(template.render(context))

def error403(request, exception):
    template = loader.get_template('app/errorHandler.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | دسترسی شما به این صفحه مجاز نیست ', 
        'message': "❌ دسترسی شما به این صفحه مجاز نیست ❌",
        'backBtn': backBtn,
    }
    return HttpResponse(template.render(context))

def error500(request):
    template = loader.get_template('app/errorHandler.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | مشکلی رخ داده است ', 
        'message': "🙄 سرور های سایت احتمالا داغ کرده لطفا یکم دیگه امتحان کنید",
        'backBtn': backBtn,
    }
    return HttpResponse(template.render(context))