import time
from crud import *
from csv import writer

categoryInFar = {
    'gaming': 'گیمینگ',
    'celebrities': 'سلبریتی',
    'movieSeries': 'فیلم و سریال',
    'physiologies': 'روانشناسی',
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
    quizzes4Option =  s.query(Quizzes4Option).all()
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
                    quiz.views, quiz.publish]  # category.monthly_views   
            writer_object = writer(f_object)
            writer_object.writerow(data)

        for quiz in quizzes4Option:
            data = [quiz.title_far, ' ', quiz.category, quiz.innerCategory,\
                    quiz.views, category.monthly_views, quiz.publish]
            writer_object = writer(f_object)
            writer_object.writerow(data)

        writer_object = writer(f_object)
        writer_object.writerow(['----------', '----------', '----------', '----------', '----------'])
        f_object.close()

    print('Exceling done')
    return

def addView(whichShouldAddViewToIt):
    whichShouldAddViewToIt.views += 1
    whichShouldAddViewToIt.monthly_views += 1

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
        quizzes4Option =  s.query(Quizzes4Option).all()

        for eachCategory in categories:
            eachCategory.monthly_views = 0
            add_session(eachCategory)
        for eachQuiz in quizzes:
            eachQuiz.monthly_views = 0
            add_session(eachQuiz)
        for eachQuiz in quizzes4Option:
            eachQuiz.monthly_views = 0
            add_session(eachQuiz)

        print('done startFromZero function')

    if now >= endAt:
        startNewMonth()
        saveMonthlyViewsInExcel()
        startTheMonthlyViewsFromZero()

    else:
        print(f'currentTime: {now}')
        print(f'targetTime: {endAt}')
        return