from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
from django.template import RequestContext


def dashboard(request):
    return render(request, "dashboard.html")

def data_dashboard(request):
    return render(request, "data-dashboard.html")
    
