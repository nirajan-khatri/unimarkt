import { Shield, AlertTriangle, Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SecuritySectionProps {
  is2FAEnabled?: boolean;
  onEnable2FA: () => void;
  onManage2FA?: () => void;
}

const SecuritySection = ({
  is2FAEnabled = false,
  onEnable2FA,
  onManage2FA,
}: SecuritySectionProps) => {
  return (
    <Card className="border-l-4  border-border border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${is2FAEnabled ? "bg-green-100 dark:bg-green-100/30" : "bg-orange-100 dark:bg-orange-100/20"}`}
            >
              <Shield
                className={`h-5 w-5 ${is2FAEnabled ? "text-green-600" : "text-orange-600"}`}
              />
            </div>
            <div>
              <CardTitle className="text-lg">
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={is2FAEnabled ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {is2FAEnabled ? (
              <>
                <Check className="h-3 w-3" />
                Enabled
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" />
                Disabled
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!is2FAEnabled ? (
          <>
            <div className="bg-orange-100 dark:bg-orange-100/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium dark:text-orange-500 text-orange-700">
                    Your account is not fully secured
                  </p>
                  <p className="text-sm dark:text-orange-600 text-orange-600">
                    Enable two-factor authentication to protect your account
                    from unauthorized access, even if someone knows your
                    password.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onEnable2FA} className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Enable 2FA Now
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-100 dark:bg-green-100/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium dark:text-green-500 text-green-700">
                    Two-factor authentication is enabled
                  </p>
                  <p className="text-sm dark:text-green-600 text-green-600">
                    Your account is protected with an additional security layer.
                  </p>
                </div>
              </div>
            </div>
            {onManage2FA && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onManage2FA}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Manage 2FA Settings
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
