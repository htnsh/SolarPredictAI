from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings
from .models import User

class CustomJWTAuthentication(JWTAuthentication):
    def get_user_id_claim(self):
        return api_settings.USER_ID_CLAIM

    def get_user_id_field(self):
        return api_settings.USER_ID_FIELD

    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token[self.get_user_id_claim()]
        except KeyError:
            raise InvalidToken('Token contained no recognizable user identification')

        try:
            # Convert string user_id to UUID if needed
            import uuid
            if isinstance(user_id, str):
                user_id = uuid.UUID(user_id)
            
            # First try to get user from Django ORM
            try:
                user = User.objects.get(**{self.get_user_id_field(): user_id})
            except User.DoesNotExist:
                # If not found in Django ORM, try MongoDB
                user = User.get_from_mongodb(user_id)
                if not user:
                    raise InvalidToken('User not found in both Django ORM and MongoDB')
                else:
                    # User found in MongoDB but not Django ORM - sync them
                    try:
                        # Save the MongoDB user to Django ORM
                        user.save()
                    except Exception as sync_error:
                        # If sync fails, still allow authentication but log the error
                        import logging
                        logger = logging.getLogger(__name__)
                        logger.error(f"Failed to sync user {user_id} to Django ORM: {sync_error}")
        except User.DoesNotExist:
            raise InvalidToken('User not found')
        except (ValueError, TypeError) as e:
            raise InvalidToken(f'Invalid user ID format: {e}')

        if not user.is_active:
            raise InvalidToken('User is inactive')

        return user
