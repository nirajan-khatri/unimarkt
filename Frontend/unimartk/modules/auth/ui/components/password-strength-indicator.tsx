import React from "react";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Shield, Loader2 } from "lucide-react";
import { usePasswordStrength } from "../../hooks/use-password-strength";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, className = "" }) => {
  const { result, isAnalyzing, error, analyzePassword } = usePasswordStrength();

  React.useEffect(() => {
    analyzePassword(password);
  }, [password, analyzePassword]);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score < 25) return "bg-red-500";
    if (score < 50) return "bg-orange-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (score: number) => {
    if (score < 25) return "Very Weak";
    if (score < 50) return "Weak";
    if (score < 75) return "Good";
    return "Strong";
  };

  const getStrengthIcon = (score: number) => {
    if (score < 50) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (score < 75) return <Shield className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        {isAnalyzing && (
          <div className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs text-muted-foreground">Analyzing...</span>
          </div>
        )}
      </div>

      <div className="relative">
        <Progress value={result?.score || 0} className="h-2" />
        <div
          className={`absolute inset-0 h-2 rounded-full transition-all duration-300 ${
            result ? getStrengthColor(result.score) : "bg-gray-200"
          }`}
          style={{ width: `${result?.score || 0}%` }}
        />
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getStrengthIcon(result.score)}
            <span className="text-sm font-medium">
              {getStrengthLabel(result.score)} ({result.score}/100)
            </span>
          </div>

          <p className="text-xs text-muted-foreground">{result.feedback}</p>

          {result.suggestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium">Suggestions:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};
