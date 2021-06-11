from .__init__ import *
from ..forms import *
import unittest, time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys

class SearchForm(unittest.TestCase):
    def setUp(self):
        options = Options()
        options.add_argument('--headless')
        self.driver = webdriver.Firefox(options=options)
        self.startUrl = 'http://localhost:8000/adverts'
        self.desiredUrl = 'http://localhost:8000/search'

    def test_searched(self):
        self.driver.get(self.startUrl)
        self.driver.find_element_by_id('id_searchInput').send_keys('taylor')
        self.driver.find_element_by_id('id_searchInput').send_keys(Keys.ENTER)

    def wait():
        time.sleep(5)

    def finalCheckForUrl(self):
        if self.driver.current_url == self.startUrl:
            self.wait()
        else:
            self.assertEqual(self.desiredUrl, self.driver.current_url)

    def tearDown(self):
        self.driver.quit

if __name__ == '__main__':
    unittest.main()