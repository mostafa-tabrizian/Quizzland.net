from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, reverse
from django.template import loader, RequestContext
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .blocks import *
from .functions import *
from .db import *
from .forms import *

from django import template
register = template.Library()

def index(request):
    template = loader.get_template('app/index.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'colorOfHeader': 'header__white',
        'headTitle': 'QuizLand | کوئیزلند بزرگترین وب‌سایت کوئيز',

        'newestQuizzes': quizzesByPublish()[:15],
        'bestestQuizzes': quizzesByViews()[:5],
        'bestestQuizzesForThisMonth': quizzesByMonthlyViews()[:5],

        'NewestCelebrityQuizSection':  quizzesByPublishWithCategory('celebrities')[:4],
        'BestestCelebrityQuizSection': quizzesBothByViewsWithCategory('celebrities')[:13],
        'MonthlyBestestCelebrityQuizSection': quizzesByMonthlyViewsWithCategory('celebrities')[:13],

        'NewestMovieSeriesQuizSection':  quizzesByPublishWithCategory('movieSeries')[:4],
        'BestestMovieSeriesQuizSection': quizzesBothByViewsWithCategory('movieSeries')[:13],
        'MonthlyBestestMovieSeriesQuizSection': quizzesByMonthlyViewsWithCategory('movieSeries')[:13],
        
        'NewestGamingQuizSection':  quizzesByPublishWithCategory('Gaming')[:4],
        'BestestGamingQuizSection': quizzesBothByViewsWithCategory('Gaming')[:13],
        'MonthlyBestestGamingQuizSection': quizzesByMonthlyViewsWithCategory('Gaming')[:13],
        
        'NewestPhysiologiesQuizSection':  quizzesPointyByPublishWithCategory('Physiologies')[:4],
        'BestestPhysiologiesQuizSection': quizzesPointyByViewsWithCategory('Physiologies')[:13],
        'MonthlyBestestPhysiologiesQuizSection': quizzesPointyByMonthlyViewsWithCategory('Physiologies')[:10]
    }
    return HttpResponse(template.render(context))

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

def category(request, categoryArg, page, sortType, numberOfResult ):
    if numberOfResult == '16' or numberOfResult == '32' or numberOfResult == '48':
        howManyElementToShow = int(numberOfResult)
        fTPage = frToPage(page, howManyElementToShow)
        template = loader.get_template('app/category/category.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            # 'headTitle': f'QuizLand | کوئیز های {categoryInFar[category]} ',
            'tools': tools,
            'category': categoryArg,
            'categories': innerCategories(categoryArg, fTPage[0], fTPage[1], sortType),
            'pageTravel': pageTravel(finalPage(howManyElementToShow, categoryArg)),
        }
        return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual()

def innerCategory(request, category, innerCategory, page, sortType, numberOfResult):
    if numberOfResult == '16' or numberOfResult == '32' or numberOfResult == '48':
        howManyElementToShow = int(numberOfResult)
        fTPage = frToPage(page, howManyElementToShow)
        InnerCategory = titleConverterFromUrlToNormalOne(innerCategory)
        # addViewToCategories(InnerCategory)
        template = loader.get_template('app/category/innerCategory.html')
        context = {
            'searchForm': SearchForm(),
            'newsletterForm': NewsletterForm(),
            'colorOfHeader': 'header__white',
            'tools': tools,
            'innerCategory': innerCategory,
            'quizzes': quizzesWithInnerCategory(category, InnerCategory, fTPage[0], fTPage[1], sortType),
            'pageTravel': pageTravel(finalPage(howManyElementToShow, InnerCategory)),
            'headTitle': f'QuizLand | {innerCategory} '
        }
        return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual()

def quiz(request, category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    print(fullTitle)
    addViewToQuizzes(fullTitle)

    template = loader.get_template('app/quiz.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'colorOfHeader': 'header__white',
        'quizDetail': quizzesByTitle(fullTitle)[0],
        'quiz_Question': quizQuestionByTitle(fullTitle),
        'headTitle': f'QuizLand | {title} ', 
    }
    return HttpResponse(template.render(context))

def quizPointy(request, category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    template = loader.get_template('app/quizPointy.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'colorOfHeader': 'header__white',
        'quizDetail': quizzesPointyByTitle(fullTitle)[0],
        'quiz_Question': quizQuestionByTitle(fullTitle),
        'headTitle': f'QuizLand | {title}',
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
        'fullTitle': fullTitle,
        'quizDetail': quizzesPointyByTitle(fullTitle)[0],
        'backBtn': backBtn,
        'score': abs(int(score)),
        'headTitle': f'QuizLand | نتیجه تست ',  
    }
    return HttpResponse(template.render(context))

def sortTheQuizzes(request, sortOfQuiz, page):
    howManyElementToShow = 12
    fTPage = frToPage(page, howManyElementToShow)

    if (sortOfQuiz == 'newest'):
        sort = quizzesByPublish().all()[fTPage[0]:fTPage[1]]
        sortPointy = quizzesPointyByPublish().all()[fTPage[0]:fTPage[1]]
        title = "جدیدترین کوئیز ها"
    elif (sortOfQuiz == 'bestest'):
        sort = quizzesByViews().all()[fTPage[0]:fTPage[1]]
        sortPointy = quizzesPointyByViews().all()[fTPage[0]:fTPage[1]]
        title = "پربازدیدترین کوئيز ها"
    elif sortOfQuiz == 'monthlyBestest':
        sort = quizzesByMonthlyViews()[fTPage[0]:fTPage[1]]
        sortPointy = quizzesPointyByMonthlyViews().all()[fTPage[0]:fTPage[1]]
        title = "پر بازدیدترین کوئیز های این ماه"

    template = loader.get_template('app/sort.html')
    context = {
        'searchForm': SearchForm(),
        'newsletterForm': NewsletterForm(),
        'quizPage': 'quiz',
        'pageTravel': pageTravel(finalPage(howManyElementToShow, 'quizzes')),
        'sort': sort,
        'sortPointy': sortPointy,
        'title': title,
        'headTitle': f'QuizLand | {title}'
    }
    return HttpResponse(template.render(context))

def sortTheQuizzesByCategory(request, category, page, sortOfQuiz):
    howManyElementToShow = 12
    fTPage = frToPage(page, howManyElementToShow)

    if sortOfQuiz == 'newest':
        sort = sortBothQuizzesByPublishWithCategories(category).all()[fTPage[0]:fTPage[1]]
        title = "جدیدترین کوئیز های"
    elif sortOfQuiz == 'bestest':
        sort = quizzesBothByViewsWithCategory(category)[fTPage[0]:fTPage[1]]
        title = "پر بازدیدترین کوئیز های"

    if category == 'physiologies':
        quizPage = 'quiz_2'
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
        'backBtn': backBtn,
        'headTitle': f'QuizLand | تماس با ما '
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
        'backBtn': backBtn,
        'headTitle': f'QuizLand | راهنما ' 
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

@csrf_exempt
def newsletter(request):
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            emailInput = form.cleaned_data['emailInput']
            usernameInput = form.cleaned_data['usernameInput']
            favoriteCategory = form.cleaned_data['favoriteCategory']

            if checkIfTheUserExistInNewsletter(emailInput) != None:
                template = loader.get_template('app/fails.html')
                context = {
                    'searchForm': SearchForm(),
                    'headTitle': 'QuizLand | خطا در ثبت ایمیل ',
                    'backBtn': backBtn
                }
            else:
                Newsletter.objects.create(
                    email= emailInput,
                    username= usernameInput,
                    favorite_Category= favoriteCategory
                )
                template = loader.get_template('app/success.html')
                context = {
                    'searchForm': SearchForm(),
                    'headTitle': 'QuizLand | ایمیل ثبت شد ',
                    'backBtn': backBtn
                }

            return HttpResponse(template.render(context))
    else:
        return pageNotFoundManual()

def pageNotFoundManual():
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