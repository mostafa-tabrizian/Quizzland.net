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
    return render_template(f'/result.html', fullTitle = fullTitle)
