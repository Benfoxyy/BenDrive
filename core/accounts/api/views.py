from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    SignUpApiSerializers,
    CustomTokenObtainPairSerializer,
    MeSerializer
)
from ..models import Profile


class RegistrationApiView(generics.GenericAPIView):
    serializer_class = SignUpApiSerializers

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = {
            "detail": "User registered successfully",
        }
        return Response(data, status=status.HTTP_201_CREATED)


class CudtomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class MeView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = MeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj