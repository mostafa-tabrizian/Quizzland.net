from flask import Flask, redirect, url_for, request, render_template
from db import *

app = Flask(__name__)

@app.route('/')
def Main():
    return render_template('index.html',
                            sortNewest = sortNewest(),
                            sortMostViews = sortMostViews(),
                            colorOfHeader = 'header__white')

@app.route('/search', methods=['GET', 'POST'])
def search():
    userSearchInput = request.form['userSearchInput']
    if request.method == 'POST':
        userSearchInputInCategoriesDb_far = s.query(Categories).filter(Categories.title_far.ilike(f'%{userSearchInput}%')).all()
        userSearchInputInCategoriesDb_eng = s.query(Categories).filter(Categories.title_eng.ilike(f'%{userSearchInput}%')).all()
        userSearchInputInQuizzesDb_far = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{userSearchInput}%')).all()
        userSearchInputInQuizzesDb_eng = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{userSearchInput}%')).all()

        return render_template('searchResult.html', 
            userSearchInput = userSearchInput,
            userSearchInputInCategoriesDb_far = userSearchInputInCategoriesDb_far,
            userSearchInputInCategoriesDb_eng = userSearchInputInCategoriesDb_eng,
            userSearchInputInQuizzesDb_far = userSearchInputInQuizzesDb_far,
            userSearchInputInQuizzesDb_eng = userSearchInputInQuizzesDb_eng
            )
    else:
        return render_template('404.html')

@app.route('/search/<searchMoreOfThis>')
def moreSearchResult(searchMoreOfThis):
    userSearchInput = searchMoreOfThis
    userSearchInputInCategoriesDb_far = s.query(Categories).filter(Categories.title_far.ilike(f'%{userSearchInput}%')).all()
    userSearchInputInCategoriesDb_eng = s.query(Categories).filter(Categories.title_eng.ilike(f'%{userSearchInput}%')).all()
    userSearchInputInQuizzesDb_far = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{userSearchInput}%')).all()
    userSearchInputInQuizzesDb_eng = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{userSearchInput}%')).all()

    return render_template('moreSearchResult.html', 
        userSearchInput = userSearchInput,
        userSearchInputInCategoriesDb_far = userSearchInputInCategoriesDb_far,
        userSearchInputInCategoriesDb_eng = userSearchInputInCategoriesDb_eng,
        userSearchInputInQuizzesDb_far = userSearchInputInQuizzesDb_far,
        userSearchInputInQuizzesDb_eng = userSearchInputInQuizzesDb_eng
    )

@app.route('/newest/<int:page>')
def newestQuiz(page):
    howManyElementToShow = 5
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow
    return render_template('/newest.html',
                            newest = newestQuizForNewestPage(fr, to),
                            lastPage = lastPage(howManyElementToShow, 'newest'))

@app.route('/mostViews/<int:page>')
def mostViewsQuiz(page):
    howManyElementToShow = 5
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow
    return render_template('/mostViews.html',
                            mostViews = mostViewsQuizForMostViewsPage(fr, to),
                            lastPage = lastPage(howManyElementToShow, 'mostViews'))

@app.route('/category/<category>/<int:page>')
def Category(category, page):
    howManyElementToShow = 8
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow
    return render_template(f'/category/category.html',
                            categories = categories(category, fr, to),
                            lastPage = lastPage(howManyElementToShow, category))
    
@app.route('/category/<category>/<innerCategory>')
def innerCategory(category, innerCategory):
    fullTitle = titleConverterFromUrlToNormalOne(innerCategory)
    addViewToCategories(fullTitle)
    return render_template(f'/category/inner-category-list.html',
                             quizzes_FilterByTitle = quizzes_FilterByTitle(fullTitle))

@app.route('/quiz/<category>/<sub_category>/<title>')
def Quiz(category, sub_category, title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    addViewToQuizzes(fullTitle)
    return render_template('/quiz.html',
                            quizDetail = quizDetail(fullTitle.strip()),
                            quiz_Question = quiz_Question(fullTitle.strip()),
                            colorOfHeader = 'header__white')

@app.route('/result/<title>')
def result(title):
    fullTitle = titleConverterFromUrlToNormalOne(title)
    return render_template('/result.html',
                            fullTitle = fullTitle,
                            fanName = fanNameOfQuiz(fullTitle))


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

# @app.route('/notFound')
# def pageNotFount():
#     return render_template('404.html')

@app.errorhandler(404)
def pageNotFound():
    return render_template('404.html'), 404


@app.errorhandler(403)
def forbidden():
    return render_template('403.html'), 403
    
@app.errorhandler(500)
def internalServerError():
    return render_template('500.html'), 500

def titleConverterFromUrlToNormalOne(title):
    splittedTitle = title.split('-')
    fullTitle = ''
    for word in splittedTitle:
        fullTitle = fullTitle + ' ' + word
    return fullTitle.strip()