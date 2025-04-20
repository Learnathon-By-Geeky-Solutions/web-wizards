from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """ Custom user manager """ 
    def create_user(self, email, name, password=None, user_type=None):
        """ Create and return a user """
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, user_type=user_type)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        """ Create and return a superuser """
        user = self.create_user(email, name, password, user_type='Admin')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser, PermissionsMixin):
    """ Custom user model """
    USER_TYPES = [
        ('Admin', 'Admin'),
        ('Doctor', 'Doctor'),
        ('Patient', 'Patient'),
    ]

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPES,
        default='Patient'
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return str(self.email)