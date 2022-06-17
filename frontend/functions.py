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