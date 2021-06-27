from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import *
from .functions import titleConverterWithSpilt

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
        return f'quizzland.net/quiz/{title}'

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
        return f'quizzland.net/category/{title}?c={obj.category}&nr=16&p=0&st=newest'

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return ['index']

    def location(self, item):
        return reverse(item)