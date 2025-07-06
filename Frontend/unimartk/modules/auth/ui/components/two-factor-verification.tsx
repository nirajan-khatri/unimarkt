"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { verifyTwoFactor, verifyBackupCode } from "../../services/api";
import { useAuth } from "../../contexts/authContext";
import { TwoFactorVerifyRequest, BackupCodeVerifyRequest } from "../../types/auth";
import { Loader, ArrowLeft } from "lucide-react";

interface TwoFactorVerificationProps {
  userId: number;
  onSuccess: () => void;
}

export const TwoFactorVerification = ({ userId, onSuccess }: TwoFactorVerificationProps) => {
  const [code, setCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [showBackupCode, setShowBackupCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const verifyMutation = useMutation({
    mutationFn: (data: TwoFactorVerifyRequest) => verifyTwoFactor(data),
    onSuccess: (data) => {
      login(data);
      onSuccess();
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Invalid 2FA code");
    },
  });

  const backupCodeMutation = useMutation({
    mutationFn: (data: BackupCodeVerifyRequest) => verifyBackupCode(data),
    onSuccess: (data) => {
      login(data);
      onSuccess();
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Invalid backup code");
    },
  });

  const handleVerify = () => {
    setErrorMsg("");
    if (code.length !== 6) {
      setErrorMsg("Please enter a 6-digit code");
      return;
    }
    verifyMutation.mutate({ user_id: userId, code });
  };

  const handleBackupCodeVerify = () => {
    setErrorMsg("");
    if (backupCode.length !== 8) {
      setErrorMsg("Please enter an 8-character backup code");
      return;
    }
    backupCodeMutation.mutate({ user_id: userId, backup_code: backupCode });
  };

  const handleBackToSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f0]">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={handleBackToSignIn}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your Google Authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showBackupCode ? (
              <>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending || code.length !== 6}
                  className="w-full"
                >
                  {verifyMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin h-4 w-4" /> Verifying...
                    </span>
                  ) : (
                    "Verify"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBackupCode(true)}
                  className="w-full"
                >
                  Use Backup Code
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter 8-character backup code"
                    value={backupCode}
                    onChange={(e) => setBackupCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))}
                    maxLength={8}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button
                  onClick={handleBackupCodeVerify}
                  disabled={backupCodeMutation.isPending || backupCode.length !== 8}
                  className="w-full"
                >
                  {backupCodeMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin h-4 w-4" /> Verifying...
                    </span>
                  ) : (
                    "Verify Backup Code"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBackupCode(false)}
                  className="w-full"
                >
                  Use 2FA Code
                </Button>
              </>
            )}
            
            {errorMsg && (
              <Alert variant="destructive">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 