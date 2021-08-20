from django.test import TestCase
import unittest, time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys

class Tests(unittest.TestCase):
    def test_searchForm(self):
        def setUp(self):
            options = Options()
            options.add_argument('--headless')
            self.browser = webdriver.Firefox(options=options)
            self.startUrl = 'http://localhost:8000/'
            self.browser.get(self.startUrl)

        def searchingFunction(self):
            self.browser.find_element_by_class_name('header__search__input').send_keys('Taylor Swift')
            time.sleep(.3)
            self.browser.find_element_by_class_name('header__search__input').send_keys(Keys.BACKSPACE)

        def tearDown(self):
            print('Search form ✅')
            self.browser.quit

        setUp(self)
        searchingFunction(self)
        time.sleep(.3)
        tearDown(self)

if __name__ == '__main__':
    unittest.main()