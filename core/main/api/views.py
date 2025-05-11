from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import StoredFileListSerializer, StoreFileSerializer
from ..models import FileModel

class StoredFileListView(generics.ListAPIView):
    serializer_class = StoredFileListSerializer
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(owner=self.request.user.user_profile)
        return qs

class StoreFileView(generics.CreateAPIView):
    serializer_class = StoreFileSerializer
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]

class DeleteFileView(generics.DestroyAPIView):
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]