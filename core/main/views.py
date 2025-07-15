from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import Profile
from .serializers import StoredFileListSerializer, StoreFileSerializer, ShareFileListSerializer
from .models import FileModel
from .tasks import send_email_task

class MyDriveListView(generics.ListAPIView):
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


class ShareListFileView(generics.ListAPIView):
    serializer_class = ShareFileListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FileModel.objects.filter(shares_with__user=user).distinct()


class ShareAddFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        obj_id = request.data.get('id')
        shares_with_emails = request.data.get('shares_with', [])

        if not obj_id:
            return Response({"detail": "File ID is required."}, status=400)
        if not isinstance(shares_with_emails, list) or not shares_with_emails:
            return Response({"detail": "shares_with must be a non-empty list of user IDs."}, status=400)

        # Fetch file and check ownership
        try:
            file_obj = FileModel.objects.get(id=obj_id)
        except FileModel.DoesNotExist:
            return Response({"detail": "File not found."}, status=404)
        
        user = file_obj.owner

        # Remove self if owner accidentally adds themself
        shares_with_emails = [email for email in shares_with_emails if email != user]

        # Fetch all valid profile objects
        profiles = Profile.objects.filter(user__email__in=shares_with_emails)

        if not profiles.exists():
            return Response({"detail": "No valid users found to share with."}, status=400)

        # Share the file
        file_obj.shares_with.add(*profiles)
        
        send_email_task.delay(
        subject='Hello from BenDrive',
        message=f'{user} shared a document in your BenDrive account!',
        recipient_list=shares_with_emails,
        from_email='benxfoxy@gmail.com'
    )

        return Response({"detail": "File shared successfully."}, status=200)


class ShareRemoveFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        obj_id = request.data.get('id')
        shares_with_emails = request.data.get('shares_with', [])

        if not obj_id:
            return Response({"detail": "File ID is required."}, status=400)
        if not isinstance(shares_with_emails, list) or not shares_with_emails:
            return Response({"detail": "shares_with must be a non-empty list of user IDs."}, status=400)

        user = request.user

        # Fetch file and check ownership
        try:
            file_obj = FileModel.objects.get(id=obj_id, owner=user.user_profile)
        except FileModel.DoesNotExist:
            return Response({"detail": "File not found."}, status=404)

        # Remove self if owner accidentally adds themself
        shares_with_emails = [email for email in shares_with_emails if email != user.email]

        # Fetch all valid profile objects
        profiles = Profile.objects.filter(user__email__in=shares_with_emails)

        if not profiles.exists():
            return Response({"detail": "No valid users found to share with."}, status=400)

        # Share the file
        file_obj.shares_with.remove(*profiles)

        return Response({"detail": "File unshared successfully."}, status=200)