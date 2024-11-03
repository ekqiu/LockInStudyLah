from django.urls import path
from .views import (
    UserProfileList,
    UserProfileDetail,
    register_view,
    MyTokenObtainPairView,
    TokenRefreshView,
    get_user,
    logout_view,
    recommend_users,
)

urlpatterns = [
    path("users/", UserProfileList.as_view(), name="user_list"),
    path("users/<int:pk>/", UserProfileDetail.as_view(), name="user_detail"),
    path("register/", register_view, name="register"),
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/", get_user, name="get_user"),
    path("logout/", logout_view, name="logout"),
    path("recommend_users/", recommend_users, name="recommend_users"),
]
