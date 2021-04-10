__aubookshelf__ = 'inderpartap'
from django.urls import path
from django.conf.urls import include
import bookshelf.modules.dashboard.views as dashboard_views

urlpatterns = [
    path(r'', dashboard_views.dashboard, name='overview'),
    path(r'data/', dashboard_views.data_dashboard, name='data'),
]
