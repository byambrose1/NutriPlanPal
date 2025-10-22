import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLogin() {
  const handleLogin = () => {
    // Redirect to main app login which will redirect back here
    window.location.href = "http://localhost:5000/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">NutriPlan Admin</CardTitle>
          <CardDescription>
            Administrative Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin access required. Please log in with an administrator account.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            Log in with Replit
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
