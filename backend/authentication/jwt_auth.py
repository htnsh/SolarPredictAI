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
            user = User.objects.get(**{self.get_user_id_field(): user_id})
        except User.DoesNotExist:
            raise InvalidToken('User not found')

        if not user.is_active:
            raise InvalidToken('User is inactive')

        return user
