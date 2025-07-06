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
        fields = ["id", "name", "email", "contact_number", "role", "two_factor_enabled"]


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


class TwoFactorSetupSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value


class TwoFactorVerifySerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    code = serializers.CharField(max_length=6, min_length=6)

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Code must contain only digits")
        return value


class TwoFactorEnableSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    code = serializers.CharField(max_length=6, min_length=6)

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Code must contain only digits")
        return value


class TwoFactorDisableSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    code = serializers.CharField(max_length=6, min_length=6)

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Code must contain only digits")
        return value


class BackupCodeVerifySerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    backup_code = serializers.CharField(max_length=8, min_length=8)

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

    def validate_backup_code(self, value):
        if not value.isalnum():
            raise serializers.ValidationError("Backup code must be alphanumeric")
        return value.upper()


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
    user_id = serializers.IntegerField()

    class Meta:
        model = User
        fields = ["user_id", "name", "email", "contact_number"]

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    security_question1 = serializers.CharField()
    answer1 = serializers.CharField()
    security_question2 = serializers.CharField()
    answer2 = serializers.CharField()
    security_question3 = serializers.CharField()
    answer3 = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        security_question1 = attrs.get("security_question1")
        answer1 = attrs.get("answer1")
        security_question2 = attrs.get("security_question2")
        answer2 = attrs.get("answer2")
        security_question3 = attrs.get("security_question3")
        answer3 = attrs.get("answer3")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist")

        if (
            user.security_question1 != security_question1
            or user.answer1 != answer1
            or user.security_question2 != security_question2
            or user.answer2 != answer2
            or user.security_question3 != security_question3
            or user.answer3 != answer3
        ):
            raise serializers.ValidationError("Security questions or answers are incorrect")

        attrs["user"] = user
        return attrs


class PasswordResetByIdSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_password = serializers.CharField(write_only=True)

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value
