from flask import Flask, redirect, url_for, request, render_template
from db import *
from blocks import *
from funcs import *

app = Flask(__name__)

@app.route('/')
def Main():
    restarterOfMonthlyViews()
    
    return render_template('index.html',
        newestQuizzes = quizzesByPublish().limit(15),
        bestestQuizzes = quizzesByViews().limit(5),
        bestestQuizzesForThisMonth = quizzesByMonthlyViews().limit(5),

        NewestCelebrityQuizSection =  quizzesByPublishWithCategory('celebrities').limit(15),
        BestestCelebrityQuizSection = quizzesByViewsWithCategory('celebrities').limit(5),
        MonthlyBestestCelebrityQuizSection = quizzesByMonthlyViewsWithCategory('celebrities').limit(5),

        NewestMovieSeriesQuizSection =  quizzesByPublishWithCategory('movieSeries').limit(15),
        BestestMovieSeriesQuizSection = quizzesByViewsWithCategory('movieSeries').limit(5),
        MonthlyBestestMovieSeriesQuizSection = quizzesByMonthlyViewsWithCategory('movieSeries').limit(5),
        
        NewestGamingQuizSection =  quizzesByPublishWithCategory('Gaming').limit(15),
        BestestGamingQuizSection = quizzesByViewsWithCategory('Gaming').limit(5),
        MonthlyBestestGamingQuizSection = quizzesByMonthlyViewsWithCategory('Gaming').limit(5),
        
        NewestPhysiologiesQuizSection =  quizzes4OptionByPublishWithCategory('Physiologies').limit(15),
        BestestPhysiologiesQuizSection = quizzes4OptionByViewsWithCategory('Physiologies').limit(5),
        MonthlyBestestPhysiologiesQuizSection = quizzes4OptionByMonthlyViewsWithCategory('Physiologies').limit(5),

        colorOfHeader = 'header__white',
        headTitle = 'QuizLand | کوئیزلند بزرگترین وب‌سایت کوئيز'
    )

@app.route('/search', methods=['GET', 'POST'])
def search():
    userSearchInput = request.form['userSearchInput']
    if request.method == 'POST':
        return render_template('searchResult.html', 
            userSearchInput = userSearchInput,
            userSearchInputInCategoriesDb_far =      categoriesByTitleFar(f'%{userSearchInput}%').limit(2),
            userSearchInputInCategoriesDb_eng =      categoriesByTitleEng(f'%{userSearchInput}%').limit(2),
            userSearchInputInQuizzesDb_far =         quizzesWithTitle(f'%{userSearchInput}%').limit(8),
            userSearchInputInQuizzesDb_eng =         quizzesByPublishWithInnerCategory(f'%{userSearchInput}%').limit(8),
            userSearchInputInQuizzes4OptionDb_far =  quizzes4OptionWithTitle(f'%{userSearchInput}%').limit(8),
            userSearchInputInQuizzes4OptionDb_eng =  quizzes4OptionByPublishWithInnerCategory(f'%{userSearchInput}%').limit(8),
            headTitle = f'QuizLand | {userSearchInput} جستجو عبارت ',
        )
    else:
        return render_template('404.html', 
            headTitle = 'QuizLand | صفحه مورد نظر پیدا نشد'
        )

@app.route('/search/<searchMoreOfThis>')
def moreSearchResult(searchMoreOfThis):
    return render_template('moreSearchResult.html', 
        userSearchInputInQuizzesDb_far = quizzesWithTitle(f'%{searchMoreOfThis}%').limit(20),
        userSearchInputInQuizzesDb_eng = quizzesByPublishWithInnerCategory(f'%{searchMoreOfThis}%').limit(20),
        userSearchInputInQuizzes4OptionDb_far = quizzes4OptionWithTitle(f'%{searchMoreOfThis}%').limit(20),
        userSearchInputInQuizzes4OptionDb_eng = quizzes4OptionByPublishWithInnerCategory(f'%{searchMoreOfThis}%').limit(20),
        headTitle = f'QuizLand | {searchMoreOfThis} جستجو عبارت',
    )

@app.route('/<sortOfQuiz>/<int:page>')
def sortAll(sortOfQuiz, page):
    howManyElementToShow = 14
    fTPage = frToPage(page, howManyElementToShow)

    if (sortOfQuiz == 'newest'):
        sort = quizzesByPublish().all()[fTPage[0]:fTPage[1]]
        title = "جدیدترین کوئیز ها"
    elif (sortOfQuiz == 'bestest'):
        sort = quizzesByViews().all()[fTPage[0]:fTPage[1]]
        title = "پربازدیدترین کوئيز ها"
    elif sortOfQuiz == 'monthlyBestest':
        sort = quizzesByMonthlyViews()[fTPage[0]:fTPage[1]]
        title = "پر بازدیدترین کوئیز های این ماه"

    return render_template('/sortMore.html',
        pageTravel = pageTravel(finalPage(howManyElementToShow, 'quizzes')),
        sort = sort,
        title = title,
        headTitle = f'QuizLand | {title}',
    )

@app.route('/<sortOfQuiz>/<category>/<int:page>')
def sortCategories(category, page, sortOfQuiz):
    howManyElementToShow = 14
    fTPage = frToPage(page, howManyElementToShow)

    if sortOfQuiz == 'newest':
        sort = sortBothQuizzesByPublishWithCategories(category).all()[fTPage[0]:fTPage[1]]
        title = "جدیدترین کوئیز های"

    elif sortOfQuiz == 'bestest':
        sort = quizzesByViewsWithCategory(category)[fTPage[0]:fTPage[1]]
        title = "پر بازدیدترین کوئیز های"

    return render_template('/sortMore.html',
        sort = sort,
        title = title,
        category = categoryInFar[category],
        pageTravel = pageTravel(finalPage(howManyElementToShow, 'quizzes')),
        headTitle = f'QuizLand | {category} {title} ',
    )

@app.route('/category/<category>/<int:page>/<sortType>/<numberOfResult>')
def category(category, page, sortType, numberOfResult):
    if numberOfResult == '8' or numberOfResult == '16' or numberOfResult == '24' or numberOfResult == '32' :
        howManyElementToShow = int(numberOfResult)
        fTPage = frToPage(page, howManyElementToShow)

        return render_template(f'/category/category.html',
            tools = tools,
            categories = categories(category, fTPage[0], fTPage[1], sortType),
            pageTravel = pageTravel(finalPage(howManyElementToShow, category)),
            headTitle = f'QuizLand | {category} ',  
        )

    else:
        return render_template('404.html')

@app.route('/category/<category>/<innerCategory>/<int:page>/<sortType>/<numberOfResult>')
def innerCategory(category, innerCategory, page, sortType, numberOfResult):
    if numberOfResult == '8' or numberOfResult == '16' or numberOfResult == '24' or numberOfResult == '32' :
        howManyElementToShow = int(numberOfResult)
        fTPage = frToPage(page, howManyElementToShow)
        InnerCat = titleConverterFromUrlToNormalOne(innerCategory)
        addViewToCategories(InnerCat)

        return render_template(f'/category/inner-category-list.html',
            colorOfHeader = 'header__white',
            tools = tools,
            innerCategory = innerCategory,
            quizzes = quizzes(category, InnerCat, fTPage[0], fTPage[1], sortType),
            pageTravel = pageTravel(finalPage(howManyElementToShow, InnerCat)),
            headTitle = f'QuizLand | {innerCategory} ',
        )
    else:
        return render_template('404.html')

@app.route('/quiz/<category>/<innerCategory>/<title>')
def Quiz(category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    return render_template('/quiz.html',
        colorOfHeader = 'header__white',
        quizDetail = firstQuizByFarsiTitle(fullTitle),
        quiz_Question = quizQuestion(category, fullTitle),
        headTitle = f'QuizLand | {title} ',  
    )

@app.route('/quiz_2/<category>/<innerCategory>/<title>')
def Quiz4Option(category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    return render_template('/quiz_4Option.html',
        colorOfHeader = 'header__white',
        quizDetail = firstQuizByFarsiTitle(fullTitle),
        quiz_Question = quizQuestion(category, fullTitle),
        headTitle = f'QuizLand | {title}',
    )

@app.route('/result/<title>')
def result(title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    return render_template('/result.html',
        fullTitle = fullTitle,
        backBtn = backBtn,
        fanName = fanNameOfQuiz(fullTitle),
        headTitle = f'QuizLand | نتیجه کوئیز ',  
    )

@app.route('/result_2/<title>/<int:score>')
def result4Option(title, score):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    return render_template('/result_4Option.html',
        fullTitle = fullTitle,
        DbOfQuiz = firstQuizByFarsiTitle(fullTitle),
        backBtn = backBtn,
        score = abs(int(score)),
        headTitle = f'QuizLand | نتیجه تست ',  

    )

@app.route('/about')
def about():
    return render_template('/about.html',
        backBtn = backBtn,
        headTitle = f'QuizLand | درباره ',  
    )

@app.route('/contact')
def contact():
    return render_template('/contact.html',
        backBtn = backBtn,
        headTitle = f'QuizLand | تماس با ما ',  
    )

@app.route('/support')
def support():
    return render_template('/support.html',
        backBtn = backBtn,
        headTitle = f'QuizLand | حمایت ',  
    )

@app.route('/privacy-policy')
def privacyPolicy():
    return render_template('/privacy-policy.html',
        backBtn = backBtn,
        headTitle = f'QuizLand | حریم خصوصی ',  
    )

@app.route('/guide')
def guide():
    return render_template('/guide.html',
        backBtn = backBtn,
        headTitle = f'QuizLand | راهنما ',  
    )

@app.route('/adverts')
def adverts():
    return render_template('/adverts.html',
        backBtn = backBtn,
        headTitle = f'QuizLand | تبلیغات ',  
    )

@app.route('/newsletter', methods=['GET', 'POST'])
def newsletter():
    userEmail = request.form['userEmail']
    userName = request.form['userName']
    userCategoriesFavorite = request.form['chosenCategory']

    if request.method == 'POST':
        data = NewsletterUser(
            userName = userName,
            email =  userEmail,
            favorite_Category = userCategoriesFavorite,
        )
        srchInDb = s.query(NewsletterUser).filter(NewsletterUser.email.ilike(userEmail)).all()

        if len(srchInDb) == 0:
            add_session(data)
            return render_template('/success.html',
                backBtn = backBtn,
            )
        else:
            return render_template('/no-success.html',
                backBtn = backBtn,
            )

@app.route('/404')
def pageNotFound():
    return render_template('errorHandler.html',
    backBtn = backBtn,
    headTitle = f'QuizLand | صفحه مورد نظر پیدا نشد ',  
    message = "🤔 صفحه‌ی مورد نظر پیدا نشد"), 404

@app.errorhandler(404)
def pageNotFound(e):
    return render_template('errorHandler.html',
    backBtn = backBtn,
    headTitle = f'QuizLand | صفحه مورد نظر پیدا نشد ', 
    message = "🤔 صفحه‌ی مورد نظر پیدا نشد"), 404

@app.errorhandler(403)
def forbidden(e):
    return render_template('errorHandler.html',
    headTitle = f'QuizLand | دسترسی شما به این صفحه مجاز نیست ', 
    backBtn = backBtn,
    message = "❌ دسترسی شما به این صفحه مجاز نیست ❌"), 403
    
@app.errorhandler(500)
def internalServerError(e):
    return render_template('errorHandler.html',
    headTitle = f'QuizLand | مشکلی رخ داده است ', 
    backBtn = backBtn,
    message = "🙄 سرور های سایت احتمالا داغ کرده لطفا یکم دیگه امتحان کنید"), 500