from .__init__ import *
from ..models import Quizzes, Newsletter_Users, Quiz_Questions

class QuizzesModelTest(TestCase):
    def test_createQuiz(self, category="test",
                    subCategory="test", title="test",
                    title_english="test",
                    monthly_views=0, views=0,
                    background='test', fan_name='test',
                    GIF20='empty.jpg', GIF40='empty.jpg',
                    GIF60='empty.jpg', GIF80='empty.jpg',
                    GIF100='empty.jpg'):
        return Quizzes.objects.create(title=title, category=category,
                                        subCategory=subCategory, title_english=title_english,
                                        monthly_views=monthly_views, views=views,
                                        background=background, fan_name=fan_name,
                                        GIF20=GIF20, GIF40=GIF40,
                                        GIF60=GIF60, GIF80=GIF80,
                                        GIF100=GIF100)

    def test_QuizCreation(self):
        createdQuiz = self.test_createQuiz()
        self.assertTrue(isinstance(createdQuiz, Quizzes))
        self.assertEqual(createdQuiz.__unicode__(), createdQuiz.title)

class QuizQuestionsModelTest(TestCase):
    def test_createQuestion(self, category="test",
                            subCategory="test", title="test",
                            title_english="test", question='test',
                            option_1='test', option_2='test',
                            option_3='test', option_4='test',
                            answer=1, answer_imGif='empty.jpg',
                            answer_text='test'):
        return Quiz_Questions.objects.create(title=title, category=category,
                                            subCategory=subCategory, title_english=title_english,
                                            question=question, option_1=option_1,
                                            option_2=option_2, option_3=option_3,
                                            option_4=option_4, answer=answer,
                                            answer_imGif=answer_imGif, answer_text=answer_text)

    def test_QuestionCreation(self):
        createdQuestion = self.test_createQuestion()
        self.assertTrue(isinstance(createdQuestion, Quiz_Questions))
        self.assertEqual(createdQuestion.__unicode__(), createdQuestion.title)

class NewsletterUsersModelTest(TestCase):
    def test_createNewsletter(self, email="test@gmail.com",
                            username='test', favorite_Category='test'):
        return Newsletter_Users.objects.create(email=email, username=username,
                                        favorite_Category=favorite_Category)

    def test_NewsletterCreation(self):
        createdNewsletterUser = self.test_createNewsletter()
        self.assertTrue(isinstance(createdNewsletterUser, Newsletter_Users))
        self.assertEqual(createdNewsletterUser.__unicode__(), createdNewsletterUser.username)