from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from accounts.models import Profile
from django.db.models import Q
from .serializers import FileSerializer
from .models import FileModel


class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["file"]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user.user_profile
        qs = qs.filter(Q(owner=user) | Q(shares_with=user))
        return qs


class MyDriveListView(generics.ListAPIView):
    serializer_class = FileSerializer
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["file"]

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(owner=self.request.user.user_profile)
        return qs


class StoreFileView(generics.CreateAPIView):
    serializer_class = FileSerializer
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]

 
class DeleteFileView(generics.DestroyAPIView):
    queryset = FileModel.objects.all()
    permission_classes = [IsAuthenticated]


class ShareListFileView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["file"]

    def get_queryset(self):
        user = self.request.user
        return FileModel.objects.filter(shares_with__user=user).distinct()


class ShareAddFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        obj_id = request.data.get("id")
        shares_with_emails = request.data.get("shares_with", [])

        if not obj_id:
            return Response({"detail": "File ID is required."}, status=400)
        if not isinstance(shares_with_emails, list) or not shares_with_emails:
            return Response(
                {"detail": "shares_with must be a non-empty list of user mails."},
                status=400,
            )

        # Fetch file and check ownership
        try:
            file_obj = FileModel.objects.get(id=obj_id, owner=request.user.user_profile)
        except FileModel.DoesNotExist:
            return Response({"detail": "File not found."}, status=404)

        user = file_obj.owner

        # Remove self if owner accidentally adds themself
        shares_with_emails = [
            email for email in shares_with_emails if email != user.user.email
        ]

        # Fetch all valid profile objects
        profiles = Profile.objects.filter(user__email__in=shares_with_emails)

        if not profiles.exists():
            return Response(
                {"detail": "No valid users found to share with."}, status=400
            )

        # Share the file
        file_obj.shares_with.add(*profiles)

        #     send_email_task.delay(
        #     subject='Hello from BenDrive',
        #     message=f'{user} shared a document in your BenDrive account!',
        #     recipient_list=shares_with_emails,
        #     from_email='benxfoxy@gmail.com'
        # )

        return Response({"detail": "File shared successfully."}, status=200)


class ShareRemoveFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        obj_id = request.data.get("id")
        shares_with_emails = request.data.get("shares_with", [])

        if not obj_id:
            return Response({"detail": "File ID is required."}, status=400)
        if not isinstance(shares_with_emails, list) or not shares_with_emails:
            return Response(
                {"detail": "shares_with must be a non-empty list of user IDs."},
                status=400,
            )

        # Fetch file and check ownership
        try:
            file_obj = FileModel.objects.get(id=obj_id, owner=request.user.user_profile)
        except FileModel.DoesNotExist:
            return Response({"detail": "File not found."}, status=404)

        user = file_obj.owner

        # Remove self if owner accidentally adds themself
        shares_with_emails = [
            email for email in shares_with_emails if email != user.user.email
        ]

        # Fetch all valid profile objects
        profiles = Profile.objects.filter(user__email__in=shares_with_emails)

        if not profiles.exists():
            return Response(
                {"detail": "No valid users found to share with."}, status=400
            )

        # Share the file
        file_obj.shares_with.remove(*profiles)

        return Response({"detail": "File unshared successfully."}, status=200)
