from django.urls import path
from .views import (
    LoginAPIView,
    RegisterAPIView,
    RoleListView,
    SecurityQuestionChoiceView,
    PasswordResetAPIView,
    CurrentUserAPIView,
    UpdateUserAPIView,
    DeleteUserAPIView,
    VerifyUserByEmailAPIView,
    UserSecurityQuestionsAPIView,
    VerifySecurityQuestionAPIView,
    TwoFactorSetupAPIView,
    TwoFactorVerifyAPIView,
    TwoFactorEnableAPIView,
    TwoFactorDisableAPIView,
    BackupCodeVerifyAPIView,
)

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("roles/", RoleListView.as_view(), name="roles"),
    path(
        "security-questions/",
        SecurityQuestionChoiceView.as_view(),
        name="security-questions",
    ),
    path("password-reset/", PasswordResetAPIView.as_view(), name="password-reset"),
    path("current-user/", CurrentUserAPIView.as_view(), name="current-user"),
    path("update-user/<int:user_id>/", UpdateUserAPIView.as_view(), name="update-user"),
    path("delete-user/<int:user_id>/", DeleteUserAPIView.as_view(), name="delete-user"),
    path("verify-user-by-email/", VerifyUserByEmailAPIView.as_view(), name="verify-user-by-email"),
    path("user-security-questions/", UserSecurityQuestionsAPIView.as_view(), name="user-security-questions"),
    path("verify-security-question/", VerifySecurityQuestionAPIView.as_view(), name="verify-security-question"),
    
    # 2FA endpoints
    path("2fa/setup/", TwoFactorSetupAPIView.as_view(), name="2fa-setup"),
    path("2fa/verify/", TwoFactorVerifyAPIView.as_view(), name="2fa-verify"),
    path("2fa/enable/", TwoFactorEnableAPIView.as_view(), name="2fa-enable"),
    path("2fa/disable/", TwoFactorDisableAPIView.as_view(), name="2fa-disable"),
    path("2fa/backup-verify/", BackupCodeVerifyAPIView.as_view(), name="2fa-backup-verify"),
]
