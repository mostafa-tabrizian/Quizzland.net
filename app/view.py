from flask import Flask, redirect, url_for, request, render_template
from db import *

app = Flask(__name__)

@app.route('/')
def Main():
    return render_template('index.html', sortNewest = sortNewest(), sortMostViews = sortMostViews())

@app.route('/quiz/<category>/<title>')
def Quiz(category, title):
    addView(title)
    return render_template(f'/quizzes/{category}/{title}.html')

@app.route('/category/<category>')
def Category(category):
    return render_template(f'/category/{category}.html')