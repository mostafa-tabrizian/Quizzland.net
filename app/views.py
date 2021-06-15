from django import template
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, reverse, redirect
from django.template import loader, RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.views.decorators.cache import cache_page
from .models import *
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
        
        'NewestPhysiologiesQuizSection':  quizzesPointyByPublishWithCategory('psychology')[:4],
        'BestestPhysiologiesQuizSection': quizzesPointyByViewsWithCategory('psychology')[:13],
        'MonthlyBestestPhysiologiesQuizSection': quizzesPointyByMonthlyViewsWithCategory('psychology')[:10]
    }

    return HttpResponse(template.render(context))

@csrf_exempt
def search(request):
    if request.GET.get('s'):
        search = request.GET.get('s')
        template = loader.get_template('app/moreSearchResult.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'headTitle': f'QuizLand | {search} جستجو عبارت ',
            'userSearchInput': search,
            'subCategoriesByTitle': subCategoriesByTitle(search)[:2],
            'quizzesByTitle': quizzesByTitle(search)[:28],
            'quizzesPointyByTitle': quizzesPointyByTitle(search)[:28],
        }

        return HttpResponse(template.render(context))
    else:
        form = SearchForm(request.POST)
        if form.is_valid():
            searchInput = form.cleaned_data['searchInput']
            template = loader.get_template('app/search.html')
            context = {
                'searchForm': SearchForm(),
                'newsletterForm': NewsletterForm(),
                'headTitle': f'QuizLand | {searchInput} جستجو عبارت ',
                'userSearchInput': searchInput,
                'subCategoriesByTitle': subCategoriesByTitle(searchInput)[:2],
                'quizzesByTitle': quizzesByTitle(searchInput)[:8],
                'quizzesPointyByTitle': quizzesPointyByTitle(searchInput)[:8],
            }

            return HttpResponse(template.render(context))

@cache_page(CACHE_TTL)
def category(request, categoryArg):
    numberOfResults = int(request.GET.get('nr'))
    page = int(request.GET.get('p'))
    sortType = request.GET.get('st')

    if numberOfResults == 16 or numberOfResults == 32 or numberOfResults == 48:
        howManyElementToShow = 12
        fTPage = frToPage(page, howManyElementToShow)
        template = loader.get_template('app/category.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'headTitle': f'QuizLand | کوئیز های {categoryInFar[categoryArg]} ',
            'description': 'کتگوری و گروه های متنوع همچون آدم های معروف و سلبریتی, خواننده, بازیگر, فیلم و سریال, گیمینگ و تست های روانشناسی',
            'keywords': 'تست های روانشناسی, سلبریتی, خواننده, بازیگر, فیلم و سریال, گیمینگ,آدم های معروف, کوئيز',
            'category': categoryArg,
            'categories': subCategories(categoryArg, fTPage[0], fTPage[1], sortType),
            'finalPage': finalPage(howManyElementToShow, categoryArg)
        }
        return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual(request)

@cache_page(CACHE_TTL)
def subCategory(request, category, subCategory):
    page = int(request.GET.get('p'))
    numberOfResults = int(request.GET.get('nr'))
    sortType = request.GET.get('st')
    
    if numberOfResults == 16 or numberOfResults == 32 or numberOfResults == 48:
        if category =='psychology':
            typeOfQuiz = 'quizPointy'
        else:
            typeOfQuiz = 'quiz'
        howManyElementToShow = 12
        fTPage = frToPage(page, howManyElementToShow)
        subCategory = titleConverterFromUrlToNormalOne(subCategory)
        # addViewToCategories(subCategory)
        template = loader.get_template('app/subCategory.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'headTitle': f'QuizLand | {subCategory} ',
            'description': f'کوئيزلند {subCategory} کوئيز های',
            'keywords': f'{subCategory} بهترین کوئيز های , {subCategory} کوئيز های',
            'colorOfHeader': 'header__white',
            'background': subCategoriesByTitle(subCategory)[0].background,
            'quizzes': quizzesWithSubCategory(category, subCategory, fTPage[0], fTPage[1], sortType),
            'typeOfQuiz': typeOfQuiz,
            'finalPage': finalPage(howManyElementToShow, subCategory),
        }
        return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual(request)

def quiz(request, title):
    subCategory = request.GET.get('ic')
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    template = loader.get_template('app/quiz.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | {fullTitle} ', 
        'description': f'کوئيز {fullTitle} ',
        'keywords': f'{fullTitle}, {subCategory}, کوئیز های ',
        'colorOfHeader': 'header__white',
        'quizDetail': quizzesByTitle(fullTitle)[0],
        'quiz_Question': quizQuestionByTitle(fullTitle),
    }
    return HttpResponse(template.render(context))

def quizPointy(request, title):
    subCategory = request.GET.get('ic')
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    template = loader.get_template('app/quizPointy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | {title}',
        'description': f'کوئيز {fullTitle} ',
        'keywords': f'{fullTitle}, {subCategory}, کوئیز های ',
        'colorOfHeader': 'header__white',
        'quizDetail': quizzesPointyByTitle(fullTitle)[0],
        'quiz_Question': quizQuestionByTitle(fullTitle),
    }
    return HttpResponse(template.render(context))

def result(request):
    title = request.GET.get('t')
    subCategory = request.GET.get('ic')
    fullTitle = titleConverterFromUrlToNormalOne(title)
    subCategory = titleConverterFromUrlToNormalOne(subCategory)
    template = loader.get_template('app/result.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'suggestingQuiz': quizzesByRandomWithSubCategory(subCategory),
        'quizDetail': quizzesByTitle(fullTitle)[0],
        'fanName': fanNameOfQuiz(fullTitle),
        'fullTitle': fullTitle,
        'headTitle': f'QuizLand | نتیجه کوئیز ',  
    }
    return HttpResponse(template.render(context))

def resultPointy(request):
    title = request.GET.get('t')
    score = request.GET.get('s')
    fullTitle = titleConverterFromUrlToNormalOne(title)
    template = loader.get_template('app/resultPointy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'fullTitle': fullTitle,
        'quizDetail': quizzesPointyByTitle(fullTitle)[0],
        'score': abs(int(score)),
        'headTitle': f'QuizLand | نتیجه تست ',  
    }
    return HttpResponse(template.render(context))

@cache_page(CACHE_TTL)
def sortTheQuizzes(request):
    page = int(request.GET.get('p'))
    sortType = request.GET.get('st')
    howManyElementToShow = 12
    fTPage = frToPage(page, howManyElementToShow)
    template = loader.get_template('app/sort.html')

    if request.GET.get('c'):
        category = request.GET.get('c')

        if sortType == 'newest':
            sort = sortBothQuizzesByPublishWithCategories(category).all()[fTPage[0]:fTPage[1]]
            title = "جدیدترین کوئیز های"
        elif sortType == 'bestest':
            sort = quizzesBothByViewsWithCategory(category)[fTPage[0]:fTPage[1]]
            title = "پر بازدیدترین کوئیز های"

        if category == 'psychology':
            quizPage = 'quizPointy'
        else:
            quizPage = 'quiz'

        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'quizPage': quizPage,
            'hideSecondColumn': 'noVis',
            'categoryStyle': 'sortMore__categoryStyle wrapper-med',
            'sort': sort,
            'title': title,
            'category': categoryInFar[category],
            'finalPage': finalPage(howManyElementToShow, 'quizzes'),
            'headTitle': f'QuizLand | {title} {categoryInFar[category]} '
        }
    else:
        if (sortType == 'newest'):
            sort = quizzesByPublish().all()[fTPage[0]:fTPage[1]]
            sortPointy = quizzesPointyByPublish().all()[fTPage[0]:fTPage[1]]
            title = "جدیدترین کوئیز ها"
            titlePointy = "جدیدترین تست ها"
        elif (sortType == 'bestest'):
            sort = quizzesByViews().all()[fTPage[0]:fTPage[1]]
            sortPointy = quizzesPointyByViews().all()[fTPage[0]:fTPage[1]]
            title = "پربازدیدترین کوئيز ها"
            titlePointy = "پربازدیدترین تست ها"
        elif sortType == 'monthlyBestest':
            sort = quizzesByMonthlyViews()[fTPage[0]:fTPage[1]]
            sortPointy = quizzesPointyByMonthlyViews().all()[fTPage[0]:fTPage[1]]
            title = "پر بازدیدترین کوئیز های این ماه"
            titlePointy = "پر بازدیدترین تست های این ماه"

        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'quizPage': 'quiz',
            'finalPage': finalPage(howManyElementToShow, 'quizzes'),
            'sort': sort,
            'sortPointy': sortPointy,
            'title': title,
            'titlePointy': titlePointy,
            'headTitle': f'QuizLand | {title}'
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
    }
    return HttpResponse(template.render(context))

def privacyPolicy(request):
    template = loader.get_template('app/privacyPolicy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
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
    }
    return HttpResponse(template.render(context))

def adverts(request):
    template = loader.get_template('app/adverts.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | تبلیغات '
    }
    return HttpResponse(template.render(context))

def support(request):
    template = loader.get_template('app/support.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
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
        'headTitle': f'QuizLand | صفحه مورد نظر پیدا نشد ', 
        'message': "🤔 صفحه‌ی مورد نظر پیدا نشد",
    }
    return HttpResponse(template.render(context))

def error404(request, exception):
    template = loader.get_template('app/errorHandler.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
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
    }
    return HttpResponse(template.render(context))

def error500(request):
    template = loader.get_template('app/errorHandler.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'headTitle': f'QuizLand | مشکلی رخ داده است ', 
        'message': "🙄 سرور های سایت احتمالا داغ کرده لطفا یکم دیگه امتحان کنید",
    }
    return HttpResponse(template.render(context))