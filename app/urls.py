#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.urls import path
from django.conf.urls import url
from django.contrib.sitemaps.views import sitemap
from .views import *
from .sitemaps import *


sitemaps = {
    'quiz':QuizSitemap,
    'subCategory':SubCategorySitemap,
    'static': StaticSitemap,
}

urlpatterns = [
    path('', index, name='index'),
    path('search', search, name='search'),
    path('category/<Sub_Category>', category, name='category'),
    path('quiz/<title>', quiz, name='quiz'),
    path('quizPointy/<title>', quizPointy, name='quizPointy'),
    path('result', result, name='result'),
    path('resultPointy', resultPointy, name='resultPointy'),
    path('sort', sortTheQuizzes, name='sort'),
    path('contact', contact, name='contact'),
    path('privacy-policy', privacyPolicy, name='privacy-policy'),
    path('guide', guide, name='guide'),
    path('adverts', adverts, name='adverts'),
    path('support', support, name='support'),
    path('newsletter', newsletter, name='newsletter'),

    path('robots.txt', robotsText, name='robots'),
    url('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),

    url(r'^ajax/doesExistInNewsletterUsers/$', doesExistInNewsletterUsers, name='doesExistInNewsletterUsers'),
    
]