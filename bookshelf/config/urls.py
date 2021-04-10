from django.urls import path
from django.conf.urls import include
from django.views.generic import RedirectView

urlpatterns = [
    path(r'', RedirectView.as_view(url='/dashboard/')),
    path(r'dashboard/', include('bookshelf.modules.dashboard.urls')),
    path(r'api/', include('bookshelf.modules.api.urls')),
]
