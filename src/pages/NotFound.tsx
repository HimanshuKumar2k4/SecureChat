import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-destructive/10">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The secure session or page you're looking for doesn't exist or may have expired.
        </p>
        <Button asChild className="w-full">
          <a href="/" className="flex items-center justify-center">
            <Home className="h-4 w-4 mr-2" />
            Return to SecureChat
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
