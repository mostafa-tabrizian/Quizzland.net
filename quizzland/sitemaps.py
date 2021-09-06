from django.contrib.sitemaps import Sitemap
from frontend.models import *

def titleConverterWithSpilt(title, oldValue, newValue):
    updatedTitle = title.replace(oldValue, newValue)
    return updatedTitle

class QuizSitemap(Sitemap):
    changefreq = "yearly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Quizzes.objects.all()

    def lastmod(self, item):
        return item.publish

    def location(self, item):
        title = titleConverterWithSpilt(item.title, ' ', '-')
        return f'/quiz/{title}'

class SubCategorySitemap(Sitemap):
    changefreq = "daily"
    priority = 0.9
    protocol = 'https'

    def items(self):
        return SubCategories.objects.all()

    def lastmod(self, item):
        return item.publish

    def location(self, item):
        subCategory = titleConverterWithSpilt(item.subCategory, ' ', '-')
        title = titleConverterWithSpilt(item.title, ' ', '-')
        return f'/category/{item.category}/{subCategory}?t={title}'

categoryTitle = {
    'کوییز هایی درمورد سلبریتی ها':'celebrity',
    'کوییز هایی درمورد فیلم و سریال':'movie-series'
}

class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9
    protocol = 'https'

    def items(self):
        return ['کوییز هایی درمورد سلبریتی ها' ,'کوییز هایی درمورد فیلم و سریال']

    def location(self, item):
        return f'/category/{categoryTitle[item]}'