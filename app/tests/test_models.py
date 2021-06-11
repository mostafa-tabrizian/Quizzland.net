from .__init__ import *
from ..models import Quizzes, Newsletter_Users, Quiz_Questions

class QuizzesModelTest(TestCase):
    def createQuiz(self, title="test",
                    category="test", innerCategory="test",
                    title_english="test", background='test',
                    fan_name='test'):
        return Quizzes.objects.create(title=title, category=category,
                                        innerCategory=innerCategory, title_english=title_english,
                                        background=background, fan_name=fan_name)

    def testQuizCreation(self):
        createdQuiz = self.createQuiz()
        self.assertTrue(isinstance(createdQuiz, Quizzes))
        self.assertEqual(createdQuiz.__unicode__(), createdQuiz.title)

class QuizQuestionsModelTest(TestCase):
    def createQuestion(self, title="test",
                    category="test", innerCategory="test",
                    title_english="test", question='test',
                    option_1='test', option_2='test',
                    option_3='test', option_4='test',
                    answer=1, answer_imGif='test',
                    answer_text='test'):
        return Quiz_Questions.objects.create(title=title, category=category,
                                            innerCategory=innerCategory, title_english=title_english,
                                            question=question, option_1=option_1,
                                            option_2=option_2, option_3=option_3,
                                            option_4=option_4, answer=answer,
                                            answer_imGif=answer_imGif, answer_text=answer_text)

    def testQuestionCreation(self):
        createdQuestion = self.createQuestion()
        self.assertTrue(isinstance(createdQuestion, Quiz_Questions))
        self.assertEqual(createdQuestion.__unicode__(), createdQuestion.title)

class NewsletterUsersModelTest(TestCase):
    def createNewsletter(self, email="test@gmail.com",
                            username='test', favorite_Category='test'):
        return Newsletter_Users.objects.create(email=email, username=username,
                                        favorite_Category=favorite_Category)

    def testNewsletterCreation(self):
        createdNewsletterUser = self.createNewsletter()
        self.assertTrue(isinstance(createdNewsletterUser, Newsletter_Users))
        self.assertEqual(createdNewsletterUser.__unicode__(), createdNewsletterUser.username)