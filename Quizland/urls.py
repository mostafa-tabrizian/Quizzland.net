from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('app.urls')),
    path('theKingAlexanderJoseph/', admin.site.urls),
]

handler404 = 'app.views.error404'
handler403 = 'app.views.error403'
handler500 = 'app.views.error500'