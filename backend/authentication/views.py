from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint"""
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return Response({
            'error': 'Registration failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint"""
    try:
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Check if user exists in MongoDB first
            user = User.get_by_email_from_mongodb(email)
            if not user:
                # Fallback to Django's user model
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check password
            if user.check_password(password):
                if not user.is_active:
                    return Response({
                        'error': 'Account is deactivated'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                return Response({
                    'message': 'Login successful',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'access': str(access_token),
                        'refresh': str(refresh)
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Login error: {e}")
        return Response({
            'error': 'Login failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """Refresh JWT token endpoint"""
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({
                'error': 'Refresh token is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        
        return Response({
            'access': str(access_token)
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        return Response({
            'error': 'Invalid refresh token'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_profile(request):
    """Get current user profile"""
    try:
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Profile fetch error: {e}")
        return Response({
            'error': 'Failed to fetch profile'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_token(request):
    """Verify if token is valid (public endpoint)"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        from rest_framework_simplejwt.tokens import AccessToken
        
        try:
            # Try to decode the token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            # Get user from database - handle UUID properly and check both MongoDB and Django ORM
            try:
                # Convert string user_id to UUID if needed
                import uuid
                if isinstance(user_id, str):
                    user_id = uuid.UUID(user_id)
                
                # First try to get user from Django ORM
                try:
                    user = User.objects.get(id=user_id)
                except User.DoesNotExist:
                    # If not found in Django ORM, try MongoDB
                    user = User.get_from_mongodb(user_id)
                    if not user:
                        logger.error(f"User not found in both Django ORM and MongoDB: {user_id}")
                        return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
                    else:
                        # User found in MongoDB but not Django ORM - sync them
                        logger.warning(f"User {user_id} found in MongoDB but not Django ORM, syncing...")
                        try:
                            # Save the MongoDB user to Django ORM
                            user.save()
                            logger.info(f"Successfully synced user {user_id} to Django ORM")
                        except Exception as sync_error:
                            logger.error(f"Failed to sync user {user_id} to Django ORM: {sync_error}")
                
                return Response({
                    'valid': True,
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            except (User.DoesNotExist, ValueError, TypeError) as e:
                logger.error(f"User lookup failed: {e}, user_id: {user_id}, type: {type(user_id)}")
                return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout(request):
    """User logout endpoint"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return Response({
            'error': 'Logout failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)