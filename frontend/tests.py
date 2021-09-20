from django.test import TestCase
import unittest
import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys


class QuizzlandTests(unittest.TestCase):
    def setUp(self):
        options = Options()
        # options.add_argument('--headless')
        self.driver = webdriver.Firefox(options=options)
        self.startUrl = 'http://localhost:8000/'
        self.driver.get(self.startUrl)

    def test_searchInput(self):
        self.driver.find_element_by_class_name(
            'header__search__input').send_keys('Taylor Swift')
        time.sleep(1)

        def searchQuizResult(self):
            numberOfQuizzes = len(
                self.driver.find_element_by_xpath(
                    "//*[@id='land']/header/nav/div[1]/div[1]/div/div[2]/ul"
                ).text.split('\n'))

            if numberOfQuizzes == 6:
                print('Searching Quiz Result ✅')
            else:
                print('Searching Quiz Result ❌')

        def searchCategoryResult(self):
            categoryTitle = self.driver.find_element_by_xpath(
                '//*[@id="land"]/header/nav/div[1]/div[1]/div/div[1]/div/div/h5/a'
            ).text

            if categoryTitle == 'Taylor Swift':
                print('Searching Category Result ✅')
            else:
                print('Searching Category Result ❌')

        searchQuizResult(self)
        searchCategoryResult(self)

    def test_category_quiz_result(self):
        def subHeaderOpenAndClickOnCategory():
            subHeaderButton = self.driver.find_element_by_xpath(
                '//*[@id="land"]/header/nav/div[2]/button[1]'
            )
            self.driver.execute_script(
                "arguments[0].click();", subHeaderButton)
            time.sleep(1)

            try:
                self.driver.find_element_by_class_name('subHeader__open')
                print('SubHeader ✅')
            except:
                print('SubHeader ❌')

        def categoryAndSubCategory():
            categoryPageLink = self.driver.find_element_by_xpath(
                '//*[@id="land"]/header/nav/ul[1]/li[2]/a'
            )
            self.driver.execute_script(
                "arguments[0].click();", categoryPageLink)
            time.sleep(1)

            subCategoryPageLink = self.driver.find_element_by_xpath(
                '//*[@id="categoryLand"]/ul/li/article/a'
            )
            self.driver.execute_script(
                "arguments[0].click();", subCategoryPageLink)
            time.sleep(1)

            subCategoryPageTitle = self.driver.find_element_by_xpath(
                '//*[@id="subCategoryLand"]/h3[2]'
            ).text

            try:
                subCategoryContent = self.driver.find_element_by_xpath(
                    '//*[@id="subCategoryLand"]/div[3]/ul/li'
                )

                if subCategoryPageTitle == 'تیلور سویفت' and subCategoryContent:
                    print('Category ✅')

            except:
                print('Category ❌')

        def quizUntilResult():
            self.driver.get(
                'http://localhost:8000/quiz/%D8%AA%DB%8C%D9%84%D9%88%D8%B1-%D8%B3%D9%88%DB%8C%D9%81%D8%AA')
            time.sleep(1)

            # check title
            quizTitle = self.driver.find_element_by_xpath(
                '//*[@id="quiz__head"]/div[1]/h1'
            ).text

            if quizTitle == 'تیلور سویفت':
                print('Quiz Title ✅')
            else:
                print('Quiz Title ❌')

            # check question counter
            questionNumber = self.driver.find_element_by_xpath(
                '//*[@id="quiz__head"]/div[2]/h5[1]'
            ).text

            if questionNumber == 'تعداد سوال ها: 14':
                print('Question Counter ✅')
            else:
                print('Question Counter ❌')

            # check date publish
            datePublish = self.driver.find_element_by_xpath(
                '//*[@id="quiz__head"]/div[2]/h5[2]'
            ).text

            if datePublish == '۷ مرداد ۱۴۰۰':
                print('Date Publish ✅')
            else:
                print('Date Publish ❌')

            # check selecting option
            quizOption = self.driver.find_element_by_xpath(
                '//*[@id="1-1"]'
            )
            self.driver.execute_script(
                "arguments[0].click();", quizOption)
            time.sleep(1)

            try:
                self.driver.find_element_by_class_name(
                    'quiz__correctAnswer'
                )
                print('Selecting Option ✅')
            except:
                print('Selecting Option ❌')

            # go next question
            goNextQuestion = self.driver.find_element_by_xpath(
                '//*[@id="quizLand"]/div[8]/div/div[15]/button'
            )
            self.driver.execute_script(
                "arguments[0].click();", goNextQuestion)
            time.sleep(1)

            nextQuestion = self.driver.find_element_by_xpath(
                '//*[@id="quizLand"]/div[8]/div/div[2]'
            )

            try:
                transformValue = self.driver.execute_script(
                    'return arguments[0].getAttribute("style")', nextQuestion
                )

                if '-48rem' in transformValue:
                    print('Question Changer (Transform) ✅')

            except:
                print('Question Changer (Transform) ❌')

        subHeaderOpenAndClickOnCategory()
        categoryAndSubCategory()
        quizUntilResult()

    def tearDown(self):
        self.driver.close()


if __name__ == '__main__':
    unittest.main()
