from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings
from django.conf.urls.static import static

from portal.views import ai_chat_handler, contact_view, api_projects, api_experiences

# ============================================================
# API ENDPOINTS (language prefiksi yo'q — frontend bevosita chaqiradi)
# ============================================================
urlpatterns = [
    path('ai-chat/', ai_chat_handler, name='ai_chat'),
    path('api/contact/', contact_view, name='api_contact'),
    path('api/projects/', api_projects, name='api_projects'),
    path('api/experiences/', api_experiences, name='api_experiences'),
]

# ============================================================
# PAGE ENDPOINTS (i18n pattern — /uz/, /ru/, /en/ prefiks bilan)
# ============================================================
urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('portal.urls')),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
