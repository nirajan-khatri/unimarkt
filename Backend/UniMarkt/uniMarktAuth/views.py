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
from .serializers import (
    LoginSerializer,
    UserSerializer,
    RegisterSerializer,
    RoleSerializer,
    PasswordResetSerializer,
    UpdateUserSerializer,
)


class LoginAPIView(APIView):

    @swagger_auto_schema(
        tags=["Auth"],
        request_body=LoginSerializer,
        responses={
            200: "JWT token and user data",
            400: "Validation error",
        },
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response(
                {
                    "user": user_data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterAPIView(APIView):
    @swagger_auto_schema(
        tags=["Auth"],
        request_body=RegisterSerializer,
        responses={201: "User registered"},
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Assign default role internally (no role in payload)

            user = serializer.save()

            # Set status based on is_admin and is_staff flags
            if not user.is_admin and not user.is_staff:
                user.status = "approved"
            else:
                user.status = "pending"

            user.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )

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
        responses={200: "Password reset successful", 400: "Validation error"},
        tags=["Auth"],
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
                "token": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Access token"
                )
            },
        ),
        responses={
            200: UserSerializer,
            400: "Token not provided",
            401: "Invalid token",
        },
    )
    def post(self, request):
        token_str = request.data.get("token")

        if not token_str:
            return Response(
                {"detail": "Token not provided."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = AccessToken(token_str)
            user_id = token["user_id"]
            user = User.objects.get(id=user_id)
        except (TokenError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class UpdateUserAPIView(APIView):
#     @swagger_auto_schema(
#         operation_description="Get current user info using access token (passed in body)",
#         tags=["Auth"],
#         request_body=UpdateUserSerializer,
#         responses={
#             200: UserSerializer,
#             400: "Token not provided",
#             401: "Invalid token",
#         },
#     )
#     def put(self, request):
#         token_str = request.data.get("token")
#         if not token_str:
#             return Response(
#                 {"detail": "Token not provided."}, status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             token = AccessToken(token_str)
#             user_id = token["user_id"]
#             user = User.objects.get(id=user_id)
#             serializer = UpdateUserSerializer(user, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(
#                     {"message": "User updated successfully"},
#                     status=status.HTTP_200_OK,
#                 )
#         except (TokenError, User.DoesNotExist):
#             return Response(
#                 {"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED
#             )


# class DeleteUserAPIView(APIView):
#     @swagger_auto_schema(
#         operation_description="Delete the currently authenticated user.",
#         tags=["Auth"],
#         responses={
#             204: "User deleted successfully",
#             401: "Unauthorized",
#             404: "User not found",
#         },
#     )
#     def delete(self, request):
#         user = request.user
#         if user:
#             user.delete()
#             return Response(
#                 {"detail": "User deleted successfully."},
#                 status=status.HTTP_204_NO_CONTENT,
#             )
#         return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class UpdateUserAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Update a user's information by user ID.",
        tags=["Auth"],
        request_body=UpdateUserSerializer,
        required=["user_id"],
        responses={
            200: UserSerializer,
            400: "Invalid request data",
            404: "User not found",
        },
    )
    def put(self, request, user_id):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"detail": "User ID not provided."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User updated successfully."}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteUserAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Delete the currently authenticated user.",
        tags=["Auth"],
        responses={
            204: "User deleted successfully",
            401: "Unauthorized",
            404: "User not found",
        },
    )
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if user:
            user.delete()
            return Response(
                {"detail": "User deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class VerifyUserByEmailAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Verify user by email. Returns user object if exists, else error message.",
        tags=["Auth"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["email"],
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, format="email", description="User email")
            },
        ),
        responses={
            200: UserSerializer,
            404: "User does not exist",
            400: "Email is required"
        },
    )
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)


class UserSecurityQuestionsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Get the first security question selected by the user during registration.",
        tags=["Auth"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["id"],
            properties={
                "id": openapi.Schema(type=openapi.TYPE_INTEGER, description="User ID")
            },
        ),
        responses={
            200: openapi.Response(
                description="User's first security question",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "key": openapi.Schema(type=openapi.TYPE_STRING, description="Security question key"),
                        "question": openapi.Schema(type=openapi.TYPE_STRING, description="Security question text"),
                    },
                ),
            ),
            404: "User does not exist",
            400: "ID is required or security question not set"
        },
    )
    def post(self, request):
        user_id = request.data.get("id")
        if not user_id:
            return Response({"error": "ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
            key = user.security_question1
            if not key:
                return Response({"error": "Security question not set for this user."}, status=status.HTTP_400_BAD_REQUEST)
            # Find the question text from SECURITY_QUESTION_CHOICES
            question = dict(User.SECURITY_QUESTION_CHOICES).get(key)
            if not question:
                return Response({"error": "Invalid security question key."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"key": key, "question": question}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
