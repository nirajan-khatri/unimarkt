from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all())

    class Meta:
        model = User
        fields = ["id", "name", "email", "contact_number", "role"]


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), email=email, password=password
            )
            if not user:
                raise serializers.ValidationError("Invalid email or password")
        else:
            raise serializers.ValidationError("Both email and password are required")

        attrs["user"] = user
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "password",
            "contact_number",
            "security_question1",
            "answer1",
            "security_question2",
            "answer2",
            "security_question3",
            "answer3",
            "is_admin",
            "is_staff",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "email", "contact_number"]

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name"]


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    security_question = serializers.ChoiceField(choices=User.SECURITY_QUESTION_CHOICES)
    answer = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        question = data.get("security_question")
        answer = data.get("answer")
        new_password = data.get("new_password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or user not found.")

        matched = False
        if user.security_question1 == question and user.answer1 == answer:
            matched = True
        elif user.security_question2 == question and user.answer2 == answer:
            matched = True
        elif user.security_question3 == question and user.answer3 == answer:
            matched = True

        if not matched:
            raise serializers.ValidationError(
                "Security question or answer is incorrect."
            )

        # ✅ Check new password is not the same as old
        if user.check_password(new_password):
            raise serializers.ValidationError(
                "New password must be different from the old password."
            )

        data["user"] = user
        return data

    def save(self):
        user = self.validated_data["user"]
        new_password = self.validated_data["new_password"]
        user.set_password(new_password)
        user.save()
        return user
