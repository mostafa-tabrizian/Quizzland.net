from django.contrib.sitemaps import Sitemap
from frontend.models import *

def titleConverterWithSpilt(title, oldValue, newValue):
    updatedTitle = title.replace(oldValue, newValue)
    return updatedTitle

class QuizSitemap(Sitemap):
    changefreq = "weekly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Quizzes_V2.objects.all()

    def lastmod(self, item):
        return item.publish

    def location(self, item):
        slug = titleConverterWithSpilt(item.slug, ' ', '-')
        return f'/play/{slug}'

class PointySitemap(Sitemap):
    changefreq = "weekly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Quizzes_Pointy.objects.all()

    def lastmod(self, item):
        return item.publish

    def location(self, item):
        slug = titleConverterWithSpilt(item.slug, ' ', '-')
        return f'/test/{slug}'