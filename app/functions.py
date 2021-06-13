import time
from csv import writer
from .forms import *

categoryInFar = {
    'gaming': 'گیمینگ',
    'celebrity': 'سلبریتی',
    'movie-series': 'فیلم و سریال',
    'physiology': 'روانشناسی',
}

def titleConverterFromUrlToNormalOne(title):
    splittedTitle = title.split('-')
    fullTitle = ''
    for word in splittedTitle:
        fullTitle = fullTitle + ' ' + word
    return fullTitle.strip()


def frToPage(page, howManyElementToShow):
    fr = page * howManyElementToShow
    to = (page * howManyElementToShow) + howManyElementToShow
    return [fr, to]

def saveMonthlyViewsInExcel():
    filename = './monthlyViewsData.csv'
    quizzes =  s.query(Quizzes).all()
    quizzesPointy =  s.query(QuizzesPointy).all()
    categories =    s.query(Categories).all()
    
    with open(filename, 'a', encoding='utf8') as f_object:

        for category in categories:
            data = [category.title_far, category.title_eng, category.category,\
                    ' ', category.views, category.monthly_views, category.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        writer_object = writer(f_object)
        writer_object.writerow(['||||||||', '||||||||', '||||||||', '||||||||', '||||||||'])

        for quiz in quizzes:
            data = [quiz.title_far, ' ', quiz.category, quiz.innerCategory,\
                    quiz.views, quiz.monthly_views, quiz.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        for quiz in quizzesPointy:
            data = [quiz.title_far, ' ', quiz.category, quiz.innerCategory,\
                    quiz.views, quiz.monthly_views, quiz.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        writer_object = writer(f_object)
        writer_object.writerow(['----------', '----------', '----------', '----------', '----------'])
        f_object.close()

    print('Exceling done')
    return

def viewsPlusOne(quizToAddView):
    quizToAddView.views += 1
    quizToAddView.monthly_views += 1
    quizToAddView.save()

startedAt = 1622007943
endAt = 1622007990
def restarterOfMonthlyViews():
    print('XXXXXXXXXXXXXXaddViewToMonthlyFunctionXXXXXXXXXXXXXXX')
    global startedAt
    global endAt
    now = time.time()

    def startNewMonth():
        global startedAt
        global endAt
        startedAt = endAt
        endAt = now + 2_592_000 #1Month
        print(f"started new month 'til {endAt}")

    def startTheMonthlyViewsFromZero():
        categories =  s.query(Categories).all()
        quizzes =  s.query(Quizzes).all()
        quizzesPointy =  s.query(QuizzesPointy).all()

        for eachCategory in categories:
            eachCategory.monthly_views = 0
            add_session(eachCategory)
        for eachQuiz in quizzes:
            eachQuiz.monthly_views = 0
            add_session(eachQuiz)
        for eachQuiz in quizzesPointy:
            eachQuiz.monthly_views = 0
            add_session(eachQuiz)

        print('done startFromZero function')

    if now >= endAt:
        startNewMonth()
        # saveMonthlyViewsInExcel()
        # startTheMonthlyViewsFromZero()

    else:
        print(f'currentTime: {now}')
        print(f'targetTime: {endAt}')
        return