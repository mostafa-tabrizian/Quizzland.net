from flask import Flask, redirect, url_for, request, render_template
from db import *

app = Flask(__name__)

@app.route('/')
def Main():
    return render_template('index.html', sortNewest = sortNewest(), sortMostViews = sortMostViews(), header__noBg = 'header__noBg')

@app.route('/<str>')
def string(str):
    return render_template(f'{str}.html')

@app.route('/category/<category>/<int:page>')
def Category(category, page):
    howManyElementToShow = 2
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow
    return render_template(f'/category/category.html', categories = categories(category, fr, to), lastPage = lastPage(category))
    
@app.route('/category/<category>/<innerCategory>')
def innerCategory(category, innerCategory):
    rawTitle = innerCategory.split('-')
    fullTitle = rawTitle[0] + ' ' + rawTitle[1]
    addViewToCategories(fullTitle)
    return render_template(f'/category/inner-category-list.html', quizzes_FilterByTitle = quizzes_FilterByTitle(fullTitle))

@app.route('/quiz/<category>/<sub_category>/<title>')
def Quiz(category, sub_category, title):
    # addView(title)
    return render_template(f'/quizzes-files/{category}/{sub_category}/{title}.html')

@app.route('/result/<title>')
def result(title):
    title = title.split('-')
    fullTitle = ''
    for title in title:
        fullTitle = fullTitle + ' ' + title
    return render_template('/result.html', fullTitle = fullTitle)

@app.route('/newsletter', methods=['GET', 'POST'])
def newsletter():
    userEmail = request.form['userEmail']
    userName = request.form['userName']
    if request.method == 'POST':
        data = NewsletterUser(
            userName = userName,
            email =  userEmail
        )
        srchInDb = s.query(NewsletterUser).filter(NewsletterUser.email.ilike(userEmail)).all()

        if len(srchInDb) == 0:
            add_session(data)
            return render_template('/success.html')
        else:
            return render_template('/no-success.html')

@app.route('/about')
def about():
    return render_template('/about.html')

@app.route('/contact')
def contact():
    return render_template('/contact.html')

@app.route('/search', methods=['GET', 'POST'])
def search():
    userSearchInput = request.form['userSearchInput']
    if request.method == 'POST':
        userSearchInputInCategoriesDb_far = s.query(Categories).filter(Categories.title_far.ilike(f'%{userSearchInput}%')).all()
        userSearchInputInCategoriesDb_eng = s.query(Categories).filter(Categories.title_eng.ilike(f'%{userSearchInput}%')).all()
        userSearchInputInQuizzesDb_far = s.query(Quizzes).filter(Quizzes.title_far.ilike(f'%{userSearchInput}%')).all()
        userSearchInputInQuizzesDb_eng = s.query(Quizzes).filter(Quizzes.title_eng.ilike(f'%{userSearchInput}%')).all()

        return render_template('searchResult.html', 
                userSearchInputInCategoriesDb_far = userSearchInputInCategoriesDb_far,
                userSearchInputInCategoriesDb_eng = userSearchInputInCategoriesDb_eng,
                userSearchInputInQuizzesDb_far = userSearchInputInQuizzesDb_far,
                userSearchInputInQuizzesDb_eng = userSearchInputInQuizzesDb_eng
                )

    else:
        return render_template('notFound.html')


