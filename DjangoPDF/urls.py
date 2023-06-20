from django.urls import path
from . import views

app_name = "DjangoPDF"

urlpatterns = [
    path("", views.home),
    path("test", views.test),
    path("ajax-QeA", views.ajax_QeA, name="ajax-QeA"),
]
