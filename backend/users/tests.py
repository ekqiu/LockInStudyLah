from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="12345")
        self.userprofile = UserProfile.objects.create(
            user=self.user,
            subjects="Maths",
            study_time_preference="Mornings",
            learning_style="Visual",
        )

    def test_user_profile_creation(self):
        self.assertEqual(self.userprofile.user.username, "testuser")
        self.assertEqual(self.userprofile.subjects, "Maths")
        self.assertEqual(self.userprofile.study_time_preference, "Mornings")
        self.assertEqual(self.userprofile.learning_style, "Visual")

    def test_user_profile_list_view(self):
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Maths")

    def test_user_profile_detail_view(self):
        response = self.client.get(f"/api/users/{self.userprofile.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "testuser")


# Create your tests here.
