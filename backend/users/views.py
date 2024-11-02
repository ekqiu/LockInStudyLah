from django.shortcuts import render
from rest_framework import generics
from .models import UserProfile
from .serializers import UserProfileSerializer


# Create your views here.
class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer