import time
from csv import writer
from .forms import *
from .models import *
from django.contrib import messages


categoryInFar = {
    'gaming': 'گیمینگ',
    'celebrity': 'سلبریتی',
    'movie series': 'فیلم و سریال',
    'psychology': 'روانشناسی',
}

def titleConverterWithSpilt(title, splitWith, replaceWith):
    splittedTitle = title.split(splitWith)
    fullTitle = ''
    for word in splittedTitle:
        fullTitle = fullTitle + replaceWith + word
    return fullTitle.strip()

def frToPage(page, howManyElementToShow):
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow
    return [fr, to]

def saveMonthlyViewsInExcel():
    filename = './monthlyViewsData.csv'
    quizzes = Quizzes.objects.all()
    quizzesPointy = Quizzes_Pointy.objects.all()
    categories = SubCategories.objects.all()
    
    with open(filename, 'a', encoding='utf8') as f_object:

        for category in categories:
            data = [category.title, category.subCategory, category.category,\
                    ' ', category.views, category.monthly_views, category.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        writer_object = writer(f_object)
        writer_object.writerow(['||||||||', '||||||||', '||||||||', '||||||||', '||||||||'])

        for quiz in quizzes:
            data = [quiz.title, ' ', quiz.category, quiz.subCategory,\
                    quiz.views, quiz.monthly_views, quiz.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        for quiz in quizzesPointy:
            data = [quiz.title, ' ', quiz.category, quiz.subCategory,\
                    quiz.views, quiz.monthly_views, quiz.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        writer_object = writer(f_object)
        writer_object.writerow(['----------', '----------', '----------', '----------', '----------'])
        f_object.close()

    messages.success('Exceling Done Successfully')
    return

def viewsPlusOne(quizToAddView):
    quizToAddView.views += 1
    quizToAddView.monthly_views += 1
    quizToAddView.save()

startedAt = 1624181387
endAt = 1626773387
def restarterOfMonthlyViews():
    global startedAt
    global endAt
    now = time.time()

    def startNewMonth():
        global startedAt
        global endAt
        startedAt = endAt
        endAt = now + 2_592_000 #1Month

    def startTheMonthlyViewsFromZero():
        quizzes = Quizzes.objects.all()
        quizzesPointy = Quizzes_Pointy.objects.all()
        categories = SubCategories.objects.all()


        for eachCategory in categories:
            eachCategory.monthly_views = 0
            eachCategory.save()
        for eachQuiz in quizzes:
            eachQuiz.monthly_views = 0
            eachQuiz.save()
        for eachQuiz in quizzesPointy:
            eachQuiz.monthly_views = 0
            eachQuiz.save()

    if now >= endAt:
        startNewMonth()
        saveMonthlyViewsInExcel()
        startTheMonthlyViewsFromZero()
        messages.success('Started new monthly views')

    else:
        messages.error('New monthly views could not started | errorLine=100 file=functions.py ')
        return