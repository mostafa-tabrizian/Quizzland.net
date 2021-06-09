from django import template

register = template.Library()

@register.filter(name='listMaker')
def listMaker(str, splitWithEach):
    splitted = str.split(f'{splitWithEach}')
    return splitted

@register.filter(name='replaceToHyphen')
def replaceToHyphen(str):
    oldValue = ' '
    newValue = '-'
    replaced = str.replace(oldValue, newValue, 99)
    return replaced

@register.filter(name='viewsFormat')
def viewsFormat(views):
    if views >= 1000:
        stringed = str(views)
        newViewsFormat = stringed[0] + '.' + stringed[1] + 'k'
    else:
        return views
    return newViewsFormat

@register.filter(name='makeTheDatePublishReadyToShow')
def makeTheDatePublishReadyToShow(date):
    date = str(date)[0:10]
    return date

@register.filter(name='toInteger')
def toInteger(str):
    return int(str)
