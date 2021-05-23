from flask import Flask, redirect, url_for, request, render_template
from db import *

app = Flask(__name__)

categoryInFar = {
    'gaming': 'گیمینگ',
    'celebrities': 'سلبریتی',
    'movieSeries': 'فیلم و سریال',
    'physiologies': 'روانشناسی',
}

@app.route('/')
def Main():
    return render_template('index.html',
        newestQuizzes__limited = quizzesByPublish().limit(15),
        bestestQuizzes__limited = quizzesByViews().limit(5),

        NewestCelebrityQuizSection = quizzesByPublishWithCategory('celebrities').limit(15),
        BestestCelebrityQuizSection = quizzesByViewsWithCategory('celebrities').limit(5),
        
        NewestMovieSeriesQuizSection = quizzesByPublishWithCategory('movieSeries').limit(15),
        BestestMovieSeriesQuizSection = quizzesByViewsWithCategory('movieSeries').limit(5),
        
        NewestGamingQuizSection = quizzesByPublishWithCategory('Gaming').limit(15),
        BestestGamingQuizSection = quizzesByViewsWithCategory('Gaming').limit(5),
        
        NewestPhysiologiesQuizSection = quizzes4OptionByPublishWithCategory('Physiologies').limit(15),
        BestestPhysiologiesQuizSection = quizzes4OptionByViewsWithCategory('Physiologies').limit(5),

        colorOfHeader = 'header__white')

@app.route('/search', methods=['GET', 'POST'])
def search():
    userSearchInput = request.form['userSearchInput']
    if request.method == 'POST':
        userSearchInputInCategoriesDb_far = categoriesByTitleFar(f'%{userSearchInput}%').all()
        userSearchInputInCategoriesDb_eng = categoriesByTitle(f'%{userSearchInput}%').all()
        userSearchInputInQuizzesDb_far = quizzesWithTitle(f'%{userSearchInput}%').all()
        userSearchInputInQuizzesDb_eng = quizzesByPublishWithInnerCategory(f'%{userSearchInput}%').all()
        userSearchInputInQuizzes4OptionDb_far = quizzes4OptionWithTitle(f'%{userSearchInput}%').all()
        userSearchInputInQuizzes4OptionDb_eng = quizzes4OptionByPublishWithInnerCategory(f'%{userSearchInput}%').all()

        return render_template('searchResult.html', 
            userSearchInput = userSearchInput,
            userSearchInputInCategoriesDb_far = userSearchInputInCategoriesDb_far,
            userSearchInputInCategoriesDb_eng = userSearchInputInCategoriesDb_eng,
            userSearchInputInQuizzesDb_far = userSearchInputInQuizzesDb_far,
            userSearchInputInQuizzesDb_eng = userSearchInputInQuizzesDb_eng,
            userSearchInputInQuizzes4OptionDb_far = userSearchInputInQuizzes4OptionDb_far,
            userSearchInputInQuizzes4OptionDb_eng = userSearchInputInQuizzes4OptionDb_eng
            )
    else:
        return render_template('404.html')

@app.route('/search/<searchMoreOfThis>')
def moreSearchResult(searchMoreOfThis):

    userSearchInput = searchMoreOfThis
    userSearchInputInQuizzesDb_far = quizzesWithTitle(f'%{userSearchInput}%').limit(20)
    userSearchInputInQuizzesDb_eng = quizzesByPublishWithInnerCategory(f'%{userSearchInput}%').limit(20)
    userSearchInputInQuizzes4OptionDb_far = quizzes4OptionWithTitle(f'%{userSearchInput}%').limit(20)
    userSearchInputInQuizzes4OptionDb_eng = quizzes4OptionByPublishWithInnerCategory(f'%{userSearchInput}%').limit(20)

    return render_template('moreSearchResult.html', 
        userSearchInput = userSearchInput,
        userSearchInputInQuizzesDb_far = userSearchInputInQuizzesDb_far,
        userSearchInputInQuizzesDb_eng = userSearchInputInQuizzesDb_eng,
        userSearchInputInQuizzes4OptionDb_far = userSearchInputInQuizzes4OptionDb_far,
        userSearchInputInQuizzes4OptionDb_eng = userSearchInputInQuizzes4OptionDb_eng
    )

@app.route('/<sortOfQuiz>/<int:page>')
def sortAll(sortOfQuiz, page):
    howManyElementToShow = 12
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow

    if (sortOfQuiz == 'bestest'):
        sort = QuizzesByViews().all()[fr:to]
        title = "بهترین کوئيز ها"
    elif (sortOfQuiz == 'newest'):
        sort = QuizzesByPublish().all()[fr:to]
        title = "جدیدترین کوئیز ها"

    return render_template('/sort.html',
                            sort = sort,
                            title = title,
                            finalPage = finalPage(howManyElementToShow, 'quizzes'))

@app.route('/<sortOfQuiz>/<category>/<int:page>')
def sortCategories(category, page, sortOfQuiz):
    howManyElementToShow = 12
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow

    if sortOfQuiz == 'newest':
        sort = sortBothQuizzesByPublishWithCategories(category).all()[fr:to]
        title = "جدیدترین کوئیز های"

    elif sortOfQuiz == 'bestest':
        sort = quizzesByViewsWithCategory(category)[fr:to]
        title = "پر بازدیدترین کوئیز های"

    return render_template('/sort.html',
                            sort = sort,
                            title = title,
                            category = categoryInFar[category],
                            finalPage = finalPage(howManyElementToShow, 'quizzes'))


@app.route('/category/<category>/<int:page>/<sortType>/<numberOfResult>')
def category(category, page, sortType, numberOfResult):
    if numberOfResult == '8' or numberOfResult == '16' or numberOfResult == '24' or numberOfResult == '32' :
        howManyElementToShow = int(numberOfResult)
        fr = page * howManyElementToShow
        to = (page * howManyElementToShow) + howManyElementToShow
        
        return render_template(f'/category/category.html',
                                categories = categories(category, fr, to, sortType),
                                finalPage = finalPage(howManyElementToShow, category))
    else:
        return render_template('404.html')

    
@app.route('/category/<category>/<innerCategory>/<int:page>/<sortType>/<numberOfResult>')
def innerCategory(category, innerCategory, page, sortType, numberOfResult):
    if numberOfResult == '8' or numberOfResult == '16' or numberOfResult == '24' or numberOfResult == '32' :
        howManyElementToShow = int(numberOfResult)
        fr = page * howManyElementToShow
        to = (page * howManyElementToShow) + howManyElementToShow
        fullTitle = titleConverterFromUrlToNormalOne(innerCategory)
        addViewToCategories(fullTitle)
        return render_template(f'/category/inner-category-list.html',
                                quizzes = quizzes(category, fullTitle, fr, to, sortType),
                                finalPage = finalPage(howManyElementToShow, fullTitle),
                                innerCategory = innerCategory,
                                colorOfHeader = 'header__white')
    else:
        return render_template('404.html')

@app.route('/quiz/<category>/<innerCategory>/<title>')
def Quiz(category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    return render_template('/quiz.html',
                            quizDetail = firstQuizByFarsiTitle(fullTitle),
                            quiz_Question = quizQuestion(category, fullTitle),
                            colorOfHeader = 'header__white')

@app.route('/quiz_2/<category>/<innerCategory>/<title>')
def Quiz4Option(category, innerCategory, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    return render_template('/quiz_4Option.html',
                            quizDetail = firstQuizByFarsiTitle(fullTitle),
                            quiz_Question = quizQuestion(category, fullTitle),
                            colorOfHeader = 'header__white')

@app.route('/result/<title>')
def result(title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    return render_template('/result.html',
                            fullTitle = fullTitle,
                            fanName = fanNameOfQuiz(fullTitle))

@app.route('/result_2/<title>/<int:score>')
def result4Option(title, score):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    return render_template('/result_4Option.html',
                            fullTitle = fullTitle,
                            DbOfQuiz = firstQuizByFarsiTitle(fullTitle),
                            score = abs(int(score)))

@app.route('/about')
def about():
    return render_template('/about.html')

@app.route('/contact')
def contact():
    return render_template('/contact.html')

@app.route('/support')
def support():
    return render_template('/support.html')

@app.route('/privacy-policy')
def privacyPolicy():
    return render_template('/privacy-policy.html')

@app.route('/adverts')
def adverts():
    return render_template('/adverts.html')

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
            return render_template('/success.html')
        else:
            return render_template('/no-success.html')

@app.route('/404')
def pageNotFound():
    return render_template('errorHandler.html',
    message = "🤔 صفحه‌ی مورد نظر پیدا نشد"), 404

@app.errorhandler(404)
def pageNotFound(e):
    return render_template('errorHandler.html',
    message = "🤔 صفحه‌ی مورد نظر پیدا نشد"), 404

@app.errorhandler(403)
def forbidden(e):
    return render_template('errorHandler.html',
    message = "❌ دسترسی شما به این صفحه مجاز نیست ❌"), 403
    
@app.errorhandler(500)
def internalServerError(e):
    return render_template('errorHandler.html',
    message = "🙄 سرور های سایت احتمالا داغ کرده لطفا یکم دیگه امتحان کنید"), 500

def titleConverterFromUrlToNormalOne(title):
    splittedTitle = title.split('-')
    fullTitle = ''
    for word in splittedTitle:
        fullTitle = fullTitle + ' ' + word
    return fullTitle.strip()