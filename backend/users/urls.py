from django.urls import path
from .views import UserProfileList, UserProfileDetail

urlpatterns = [
    path("users/", UserProfileList.as_view(), name="user_list"),
    path("users/<int:pk>/", UserProfileDetail.as_view(), name="user_detail"),
]
