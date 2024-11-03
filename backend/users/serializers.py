from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "subjects",
            "study_time_preference",
            "learning_style",
            "total_study_time",
        ]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom response data
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
        }
        return data
