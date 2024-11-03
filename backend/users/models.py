from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subjects = models.CharField(max_length=255)
    study_time_preference = models.CharField(max_length=255)
    learning_style = models.CharField(max_length=255)
    total_study_time = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
