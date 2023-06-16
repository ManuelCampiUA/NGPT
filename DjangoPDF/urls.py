from django.urls import path
from . import views

app_name = 'DjangoPDF'

urlpatterns = [
    path('', views.home, name='home_page'),
]