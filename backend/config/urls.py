from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings
from django.conf.urls.static import static

from portal.views import ai_chat_handler

urlpatterns = [
    path('ai-chat/', ai_chat_handler, name='ai_chat'),
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('portal.urls')),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
