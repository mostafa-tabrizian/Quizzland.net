from .__init__ import *
from ..views import *

class ViewsTest(TestCase):
    def test_View(self):
        views = (
            ('/category/celebrities/0/newest/16', 'app/category/category.html'),
            ('/category/celebrities/taylor-swift/0/newest/16', 'app/category/subCategory.html'),
            ('/newest/0', 'app/sort.html'),
            ('/bestest/movieSeries/0', 'app/sort.html'),
            ('/contact', 'app/contact.html'),
            ('/privacy-policy', 'app/privacyPolicy.html'),
            ('/guide', 'app/guide.html'),
            ('/adverts', 'app/adverts.html'),
            ('/support', 'app/support.html')
        )

        for view in views:
            url = view[0]
            desiredResponse = view[1]
            print(url, desiredResponse)
            response = self.client.get(url)

            self.assertEqual(response.status_code, 200)
            self.assertTemplateUsed(response, desiredResponse)