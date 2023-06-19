from django.shortcuts import render


def home(request):
    return render(request, 'DjangoPDF/index.html')
