from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('emp_app.urls')),  
    path('api/account/', include('account.urls')),

]

