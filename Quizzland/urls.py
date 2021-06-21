from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', include('app.urls')),
    path('admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    path('theKingAlexanderJoseph', admin.site.urls),
]

handler404 = 'app.views.error404'
handler403 = 'app.views.error403'
handler500 = 'app.views.error500'

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_DOC_ROOT, document_root=settings.STATIC_DOC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
