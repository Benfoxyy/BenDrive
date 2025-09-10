from rest_framework import serializers
from .models import FileModel


class FileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_size_in_mb = serializers.SerializerMethodField()
    owner = serializers.StringRelatedField()
    shares_with = serializers.SerializerMethodField(read_only=True)
    file_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FileModel
        fields = [
            "id",
            "owner",
            "file",
            "file_url",
            "file_name",
            "file_size_in_mb",
            "shares_with",
            "created_date",
        ]
        extra_kwargs = {
            "file": {"write_only": True},
        }
        read_only_fields = [
            "id",
            "file_url",
            "file_size_in_mb",
            "owner",
            "size",
            "created_date",
        ]

    def get_shares_with(self, obj):
        return [profile.user.email for profile in obj.shares_with.all()]

    def get_file_name(self, obj):
        return obj.file_name

    def to_representation(self, instance):
        """Customize output depending on who is requesting."""
        rep = super().to_representation(instance)

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            # If the current user is in shares_with -> hide the field
            if instance.shares_with.filter(user=request.user).exists():
                rep.pop("shares_with", None)

        return rep

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user.user_profile
        file = validated_data["file"]
        if file.size > user.storage_capacity:
            need = file.size - user.storage_capacity
            raise serializers.ValidationError(
                {
                    "size": "You don't have enough space for storing this data.",
                    "detail": f"Need more extra {need / (1024 * 1024):.3f} MB space to continue.",
                }
            )
        validated_data["owner"] = user
        return super().create(validated_data)

    def get_file_url(self, obj):
        return obj.file_url

    def get_file_size_in_mb(self, obj):
        return obj.file_size_in_mb
