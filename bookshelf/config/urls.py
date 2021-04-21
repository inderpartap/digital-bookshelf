from django.urls import path
from django.conf.urls import include
from django.views.generic import RedirectView
import bookshelf.config.settings.main as settings
from django.conf.urls.static import static

urlpatterns = [
    path(r'', RedirectView.as_view(url='/dashboard/')),
    path(r'dashboard/', include('bookshelf.modules.dashboard.urls')),
    path(r'api/', include('bookshelf.modules.api.urls')),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
