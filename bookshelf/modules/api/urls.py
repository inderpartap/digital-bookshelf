from django.urls import path
import bookshelf.modules.api.views as views
urlpatterns = [
    path(r'data', views.get_data, name='home')
]