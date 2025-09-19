import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onResendEmail: () => void;
}

const EmailVerification = ({ email, onVerificationComplete, onResendEmail }: EmailVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendCode = async () => {
    setIsLoading(true);
    onResendEmail();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a confirmation email to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">
                Please click the link in your email to verify your account and complete the signup process.
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Check your spam/junk folder if you don't see the email</p>
              <p>• The verification link will expire in 24 hours</p>
              <p>• You'll be automatically logged in after verification</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?
            </p>
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground text-center">
            <p>Once you click the email link, you'll be redirected back to the portal and automatically logged in.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;