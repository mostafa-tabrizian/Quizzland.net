from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import *
from .functions import titleConverterWithSpilt

class QuizSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'http'

    def items(self):
        return Quizzes.objects.all()

    def lastmod(self, obj):
        return obj.publish

    def location(self,obj):
        title = titleConverterWithSpilt(obj.title, ' ', '-')
        return '/quiz/%s' % (title)

class SubCategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'http'

    def items(self):
        return SubCategories.objects.all()

    def lastmod(self, obj):
        return obj.publish

    def location(self,obj):
        title = titleConverterWithSpilt(obj.subCategory, ' ', '-')
        return f'/category/{title}?c={obj.category}&nr=16&p=0&st=newest'

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return ['index']

    def location(self, item):
        return reverse(item)