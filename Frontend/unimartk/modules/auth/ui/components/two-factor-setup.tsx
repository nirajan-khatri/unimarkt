"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setupTwoFactor, enableTwoFactor } from "../../services/api";
import { TwoFactorEnableRequest } from "../../types/auth";
import { Loader } from "lucide-react";

interface TwoFactorSetupProps {
  userId: number;
  onSuccess: (backupCodes?: string[]) => void;
  onCancel: () => void;
  initialStep?: "setup" | "verify";
}

export const TwoFactorSetup = ({ userId, onSuccess, onCancel, initialStep = "setup" }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<"setup" | "verify">(initialStep);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const setupMutation = useMutation({
    mutationFn: () => setupTwoFactor(userId),
    onSuccess: (data) => {
      setQrCode(data.qr_code);
      setSecret(data.secret);
      setStep("verify");
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Failed to setup 2FA");
    },
  });

  const enableMutation = useMutation({
    mutationFn: (data: TwoFactorEnableRequest) => enableTwoFactor(data),
    onSuccess: (data) => {
      setBackupCodes(data.backup_codes);
      onSuccess(data.backup_codes);
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Failed to enable 2FA");
    },
  });

  // Auto-trigger setup when component mounts with initialStep="verify"
  useEffect(() => {
    if (initialStep === "verify") {
      handleSetup();
    }
  }, [initialStep]);

  const handleSetup = () => {
    setErrorMsg("");
    setupMutation.mutate();
  };

  const handleEnable = () => {
    setErrorMsg("");
    if (verificationCode.length !== 6) {
      setErrorMsg("Please enter a 6-digit code");
      return;
    }
    enableMutation.mutate({ user_id: userId, code: verificationCode });
  };

  if (step === "setup") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enhance your account security with 2FA using Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSetup}
            disabled={setupMutation.isPending}
            className="w-full"
          >
            {setupMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin h-4 w-4" /> Setting up...
              </span>
            ) : (
              "Setup 2FA"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
          
          {errorMsg && (
            <Alert variant="destructive">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Two-Factor Authentication</CardTitle>
        <CardDescription>
          Scan the QR code with Google Authenticator and enter the verification code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {qrCode && (
          <div className="flex justify-center">
            <img src={qrCode} alt="QR Code" className="border rounded-lg" />
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Manual entry code: <code className="bg-muted px-2 py-1 rounded">{secret}</code>
          </p>
          <Input
            type="text"
            placeholder="Enter 6-digit verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>
        
        <Button
          onClick={handleEnable}
          disabled={enableMutation.isPending || verificationCode.length !== 6}
          className="w-full"
        >
          {enableMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="animate-spin h-4 w-4" /> Enabling...
            </span>
          ) : (
            "Enable 2FA"
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setStep("setup")}
          className="w-full"
        >
          Back
        </Button>
        
        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 