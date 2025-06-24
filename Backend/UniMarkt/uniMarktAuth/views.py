from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from drf_yasg import openapi



from .models import Role, User
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer, RoleSerializer, PasswordResetSerializer


class LoginAPIView(APIView):

    @swagger_auto_schema(
        tags=["Auth"],
        request_body=LoginSerializer,
        responses={
            200: "JWT token and user data",
            400: "Validation error",
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'user': user_data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterAPIView(APIView):
    @swagger_auto_schema(tags=["Auth"], request_body=RegisterSerializer, responses={201: "User registered"})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Assign default role internally (no role in payload)

            user = serializer.save()

           

            # Set status based on is_admin and is_staff flags
            if not user.is_admin and not user.is_staff:
                user.status = 'approved'
            else:
                user.status = 'pending'

            user.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

class RoleListView(APIView):

    @swagger_auto_schema(tags=["Auth"])
    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SecurityQuestionChoiceView(APIView):
    @swagger_auto_schema(tags=["Auth"])
    def get(self, request):
        choices = User.SECURITY_QUESTION_CHOICES
        data = [{"key": key, "question": question} for key, question in choices]
        return Response(data, status=status.HTTP_200_OK)


class PasswordResetAPIView(APIView):
    @swagger_auto_schema(
        request_body=PasswordResetSerializer,
        responses={200: 'Password reset successful', 400: 'Validation error'},
        tags=['Auth']
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password reset successful."}, status=200)
        return Response(serializer.errors, status=400)
    
class CurrentUserAPIView(APIView):

    @swagger_auto_schema(
        operation_description="Get current user info using access token (passed in body)",
        tags=["Auth"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["token"],
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING, description='Access token')
            },
        ),
        responses={
            200: UserSerializer,
            400: "Token not provided",
            401: "Invalid token",
        }
    )
    def post(self, request):
        token_str = request.data.get("token")

        if not token_str:
            return Response({"detail": "Token not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = AccessToken(token_str)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)
        except (TokenError, User.DoesNotExist):
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)