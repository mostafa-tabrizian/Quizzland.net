from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import *

class QuizSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'http'

    def items(self):
        return Quizzes.objects.all()

    def lastmod(self, obj):
        return obj.publish

    def location(self,obj):
        return '/quiz/%s' % (obj.title)

class SubCategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'http'

    def items(self):
        return SubCategories.objects.all()

    def lastmod(self, obj):
        return obj.publish

    def location(self,obj):
        return '/category/%s' % (obj.title)

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return ['index']

    def location(self, item):
        return reverse(item)