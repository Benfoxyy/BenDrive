from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from accounts.models import User, Profile


class SignUpApiSerializers(serializers.ModelSerializer):
    password_conf = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "password_conf"]

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password_conf"):
            raise serializers.ValidationError(
                {"password": "Passwords do not match"}
            )
        try:
            validate_password(attrs.get("password"))
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.pop("password_conf")
        return User.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        validated_data = super().validate(attrs)
        validated_data.pop("refresh")
        return validated_data
    
class MeSerializer(serializers.ModelSerializer):
    storage_capacity_in_mb = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'storage_capacity_in_mb', 'created_date']

    def get_storage_capacity_in_mb(self, obj):
        return obj.storage_capacity_in_mb