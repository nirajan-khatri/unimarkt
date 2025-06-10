from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Role
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer, RoleSerializer


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
            role_id = request.data.get("role")
            role = get_object_or_404(Role, id=role_id)
            user = serializer.save(role=role)
            if role.name.lower() == "superuser":
                user.is_staff = True
                user.is_superuser = True
                user.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoleListView(APIView):

    @swagger_auto_schema(tags=["Auth"])
    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)