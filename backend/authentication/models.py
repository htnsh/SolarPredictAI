from django.db import models
from django.contrib.auth.models import AbstractUser
from .mongodb import get_users_collection
import bcrypt
import uuid
from datetime import datetime

class User(models.Model):
    """
    Django model for user authentication.
    This works alongside MongoDB for user data storage.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    password_hash = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

    def set_password(self, raw_password):
        """Hash and set the password"""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(raw_password.encode('utf-8'), salt).decode('utf-8')
        self.save()

    def check_password(self, raw_password):
        """Check if the provided password is correct"""
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def save_to_mongodb(self):
        """Save user data to MongoDB"""
        users_collection = get_users_collection()
        user_data = {
            '_id': str(self.id),
            'email': self.email,
            'name': self.name,
            'password_hash': self.password_hash,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
        users_collection.update_one(
            {'_id': str(self.id)},
            {'$set': user_data},
            upsert=True
        )

    @classmethod
    def get_from_mongodb(cls, user_id):
        """Get user data from MongoDB"""
        users_collection = get_users_collection()
        user_data = users_collection.find_one({'_id': str(user_id)})
        if user_data:
            user = cls()
            user.id = user_data['_id']
            user.email = user_data['email']
            user.name = user_data['name']
            user.password_hash = user_data['password_hash']
            user.is_active = user_data['is_active']
            user.created_at = datetime.fromisoformat(user_data['created_at'])
            user.updated_at = datetime.fromisoformat(user_data['updated_at'])
            return user
        return None

    @classmethod
    def get_by_email_from_mongodb(cls, email):
        """Get user by email from MongoDB"""
        users_collection = get_users_collection()
        user_data = users_collection.find_one({'email': email})
        if user_data:
            user = cls()
            user.id = user_data['_id']
            user.email = user_data['email']
            user.name = user_data['name']
            user.password_hash = user_data['password_hash']
            user.is_active = user_data['is_active']
            user.created_at = datetime.fromisoformat(user_data['created_at'])
            user.updated_at = datetime.fromisoformat(user_data['updated_at'])
            return user
        return None