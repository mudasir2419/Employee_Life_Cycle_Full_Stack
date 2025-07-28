from django.urls import path
from .views import RegisterView, LoginView, ProfileView, ForgotPasswordView, ResetPasswordView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),  
    path('reset-password/', ResetPasswordView.as_view()),    
]


