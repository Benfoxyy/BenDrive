from rest_framework import serializers
from ..models import FileModel

class StoredFileListSerializer(serializers.ModelSerializer):
    file_size_in_mb = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = FileModel
        fields = ['id', 'file_url', 'file_size_in_mb']

    def get_file_url(self, obj):
        return obj.file_url

    def get_file_size_in_mb(self, obj):
        return obj.file_size_in_mb

class StoreFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FileModel
        fields = ['owner', 'file', 'file_url', 'size']
        read_only_fields = ['owner', 'size']
        extra_kwargs = {
            'file': {'write_only': True},
        }

    def create(self, validated_data):
        request = self.context['request']
        user = request.user.user_profile
        file = validated_data['file']
        if file.size > user.storage_capacity:
            need = file.size - user.storage_capacity
            raise serializers.ValidationError({
            'size': "You don't have enough space for storing this data.",
            'detail': f"Need more extra {need / (1024 * 1024):.3f} MB space to continue."
            })
        validated_data['owner'] = user
        return super().create(validated_data)
    
    def get_file_url(self, obj):
        return obj.file_url