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


def addView(whichShouldAddViewToIt):
    whichShouldAddViewToIt.views += 1