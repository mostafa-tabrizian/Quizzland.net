from http import HTTPStatus
from .__init__ import *
from ..views import *

class ViewsTest(TestCase):
    def test_View(self):
        views = (
            ('/category/celebrity?nr=16&p=0&st=newest', 'app/category.html'),
            ('/sort?p=0&st=newest', 'app/sort.html'),
            ('/sort?p=0&st=bestest&c=psychology', 'app/sort.html'),
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

class RobotsTxtTests(TestCase):
    def test_get(self):
        response = self.client.get("/robots.txt")

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response["content-type"], "text/plain")
        lines = response.content.decode().splitlines()
        self.assertEqual(lines[0], "User-Agent: *")

    def test_post_disallowed(self):
        response = self.client.post("/robots.txt")

        self.assertEqual(HTTPStatus.METHOD_NOT_ALLOWED, response.status_code)