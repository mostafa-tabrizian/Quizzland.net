from django.contrib.sitemaps import Sitemap
from frontend.models import *

def titleConverterWithSpilt(title, oldValue, newValue):
    updatedTitle = title.replace(oldValue, newValue)
    return updatedTitle

class QuizSitemap(Sitemap):
    changefreq = "monthly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Quizzes.objects.all()

    def lastmod(self, obj):
        return obj.publish

    def location(self,obj):
        title = titleConverterWithSpilt(obj.title, ' ', '-')
        return f'/quiz/{title}'

class SubCategorySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return SubCategories.objects.all()

    def lastmod(self, obj):
        return obj.publish

    def location(self,obj):
        title = titleConverterWithSpilt(obj.subCategory, ' ', '-')
        return f'/category/{obj.category}/{title}'