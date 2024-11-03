import pandas as pd
from sklearn.neighbors import NearestNeighbors
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import UserProfile
from .serializers import (
    UserProfileSerializer,
    MyTokenObtainPairSerializer,
)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Create your views here.
class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


@api_view(["POST"])
def register_view(request):
    print("Request data:", request.data)
    print("User authenticated:", request.user.is_authenticated)
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response(
            {"status": "fail", "message": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if User.objects.filter(username=username).exists():
        return Response(
            {"status": "fail", "message": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = User.objects.create_user(username=username, password=password)
    user.save()
    return Response({"status": "success"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response(
            {"status": "fail", "message": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"status": "fail", "message": "Invalid username or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    login(request, user)
    return Response({"status": "success"}, status=status.HTTP_200_OK)


@api_view(["GET", "PUT"])
def get_user(request):
    if request.method == "GET":
        print("User authenticated:", request.user.is_authenticated)
        if request.user.is_authenticated:
            user = request.user
            user_profile, created = UserProfile.objects.get_or_create(user=user)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
            )
    elif request.method == "PUT":
        if request.user.is_authenticated:
            user = request.user
            data = request.data
            user_profile, created = UserProfile.objects.get_or_create(user=user)
            user_profile.subjects = data.get("subjects", user.userprofile.subjects)
            user_profile.study_time_preference = data.get(
                "study_time_preference", user.userprofile.study_time_preference
            )
            user_profile.learning_style = data.get(
                "learning_style", user.userprofile.learning_style
            )
            user_profile.total_study_time = data.get(
                "total_study_time", user.userprofile.total_study_time
            )
            user_profile.save()
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
            )


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"status": "success"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def recommend_users(request):
    try:
        # Fetch all user profiles
        user_profiles = UserProfile.objects.all()
        data = {
            "user_id": [],
            "subjects": [],
            "study_time_preference": [],
            "learning_style": [],
        }

        for profile in user_profiles:
            data["user_id"].append(profile.user.id)
            data["subjects"].append(profile.subjects)
            data["study_time_preference"].append(profile.study_time_preference)
            data["learning_style"].append(profile.learning_style)

        df = pd.DataFrame(data)
        print("DataFrasme created:\n", df)  # Debugging statement

        # Check if the DataFrame is empty
        if df.empty:
            return Response(
                {"error": "No user profiles found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Convert categorical data to numerical data
        df_encoded = pd.get_dummies(
            df, columns=["subjects", "study_time_preference", "learning_style"]
        )
        print("Encoded DataFrame:\n", df_encoded)  # Debugging statement

        # Fit the KNN model
        model_knn = NearestNeighbors(metric="cosine", algorithm="brute")
        model_knn.fit(df_encoded.drop("user_id", axis=1).values)

        # Get the user_id from the request
        user_id = int(request.query_params.get("user_id"))
        print(f"Received user_id: {user_id}")  # Debugging statement

        # Check if the user_id exists in the DataFrame
        if user_id not in df["user_id"].values:
            return Response(
                {"error": "User ID not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Find the nearest neighbors for the given user
        user_index = df[df["user_id"] == user_id].index[0]
        distances, indices = model_knn.kneighbors(
            df_encoded.drop("user_id", axis=1).iloc[user_index].values.reshape(1, -1),
            n_neighbors=3,
        )
        print(f"Distances: {distances}, Indices: {indices}")  # Debugging statement

        # Get the recommended user IDs
        recommended_user_ids = df.iloc[indices.flatten()]["user_id"].tolist()

        # Exclude the input user_id from the recommendations
        recommended_user_ids = [uid for uid in recommended_user_ids if uid != user_id]

        # Fetch the recommended user profiles
        recommended_users = UserProfile.objects.filter(
            user__id__in=recommended_user_ids
        )
        serializer = UserProfileSerializer(recommended_users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}")  # Debugging statement
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
