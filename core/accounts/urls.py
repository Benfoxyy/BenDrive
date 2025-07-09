from django.urls import path
from . import views

app_name = "api-v1"

urlpatterns = [
    # registraion
    path("registration/", views.RegistrationApiView.as_view(), name="registration"),
    # JWT urls
    path('jwt/access/', views.CudtomTokenObtainPairView.as_view(), name='jwt_access'),
    # Get me
    path('me/', views.MeView.as_view(), name="me")
]
