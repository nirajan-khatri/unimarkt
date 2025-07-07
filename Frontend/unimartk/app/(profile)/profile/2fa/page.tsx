"use client";

import { useState } from "react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { disableTwoFactor, setupTwoFactor, enableTwoFactor } from "@/modules/auth/services/api";
import { TwoFactorVerifyRequest, TwoFactorEnableRequest } from "@/modules/auth/types/auth";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Key, Loader, Smartphone, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function TwoFactorAuthPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [showQRSetup, setShowQRSetup] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showCodes, setShowCodes] = useState(false);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const setupMutation = useMutation({
    mutationFn: () => setupTwoFactor(parseInt(user?.id || "0")),
    onSuccess: (data) => {
      setQrCode(data.qr_code);
      setSecret(data.secret);
      setShowQRSetup(true);
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Failed to setup 2FA");
    },
  });

  const enableMutation = useMutation({
    mutationFn: (data: TwoFactorEnableRequest) => enableTwoFactor(data),
    onSuccess: (data) => {
      setCodes(data.backup_codes);
      setShowCodes(true);
      setSuccessMsg("2FA has been enabled successfully");
      setShowQRSetup(false);
      // Update user state to reflect 2FA is enabled
      if (user) {
        updateUser({ ...user, two_factor_enabled: true });
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Failed to enable 2FA");
    },
  });

  const disableMutation = useMutation({
    mutationFn: (data: TwoFactorVerifyRequest) => disableTwoFactor(data),
    onSuccess: () => {
      setSuccessMsg("2FA has been disabled successfully");
      setDisableCode("");
      // Update user state to reflect 2FA is disabled
      if (user) {
        updateUser({ ...user, two_factor_enabled: false });
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Failed to disable 2FA");
    },
  });

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
    if (!user) {
      setErrorMsg("User not found");
      return;
    }
    enableMutation.mutate({ user_id: parseInt(user.id), code: verificationCode });
  };

  const handleDisable = () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (disableCode.length !== 6) {
      setErrorMsg("Please enter a 6-digit code");
      return;
    }
    if (!user) {
      setErrorMsg("User not found");
      return;
    }
    disableMutation.mutate({ user_id: parseInt(user.id), code: disableCode });
  };

  const handleCopyCodes = () => {
    if (codes) {
      navigator.clipboard.writeText(codes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      setSuccessMsg(""); // Remove old success message
    }
  };

  const handleDownloadCodes = () => {
    if (codes) {
      const blob = new Blob([codes.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup-codes.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to manage your 2FA settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Two-Factor Authentication</h1>
        <p className="text-muted-foreground">
          Enhance your account security with two-factor authentication
        </p>
      </div>

      {successMsg && (
        <Alert className="mb-6">
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {!user.two_factor_enabled ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Step 1: Download Authenticator App
            </CardTitle>
            <CardDescription>
              First, download an authenticator app on your mobile device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  📱
                </div>
                <h3 className="font-medium">Google Authenticator</h3>
                <p className="text-sm text-muted-foreground">Free & Secure</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  🔐
                </div>
                <h3 className="font-medium">Microsoft Authenticator</h3>
                <p className="text-sm text-muted-foreground">Enterprise Ready</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  🛡️
                </div>
                <h3 className="font-medium">Authy</h3>
                <p className="text-sm text-muted-foreground">Multi-Device</p>
              </div>
            </div>
            <Button
              onClick={handleSetup}
              disabled={setupMutation.isPending}
              className="w-full"
            >
              {setupMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin h-4 w-4" /> Setting up 2FA...
                </span>
              ) : (
                "I've Downloaded an App - Continue"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Disable Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter your 2FA code to disable two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit 2FA code"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={disableMutation.isPending || disableCode.length !== 6}
                  variant="destructive"
                  className="w-full"
                >
                  {disableMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin h-4 w-4" /> Disabling...
                    </span>
                  ) : (
                    "Disable 2FA"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disable 2FA? This will make your account less secure.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setConfirmOpen(false);
                      handleDisable();
                    }}
                    disabled={disableMutation.isPending}
                  >
                    {disableMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="animate-spin h-4 w-4" /> Disabling...
                      </span>
                    ) : (
                      "Yes, Disable 2FA"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}

      {showQRSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Step 2: Scan QR Code</CardTitle>
                <CardDescription>
                  Scan this QR code with your authenticator app
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
                  onClick={() => setShowQRSetup(false)}
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
          </div>
        </div>
      )}

      {showCodes && codes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Your Backup Codes</CardTitle>
                <CardDescription>
                  Save these codes in a secure place. Each code can be used once. You will not be able to see them again.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {codes.map((code, idx) => (
                    <div key={idx} className="font-mono text-lg bg-muted rounded px-2 py-1 text-center">
                      {code}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Tooltip open={copied} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button type="button" onClick={handleCopyCodes} variant="secondary">
                        Copy Codes
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>Copied!</TooltipContent>
                  </Tooltip>
                  <Button type="button" onClick={handleDownloadCodes} variant="secondary">
                    Download Codes
                  </Button>
                  <Button type="button" onClick={() => { setShowCodes(false); setCodes(null); }} variant="outline">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 