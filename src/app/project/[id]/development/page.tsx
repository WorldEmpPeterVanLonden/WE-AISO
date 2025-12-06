import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DevelopmentForm } from "@/app/components/development-form";

export default function DevelopmentPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Phase (ISO 42001 §8.3)</CardTitle>
          <CardDescription>Document the development environment, dependencies, and testing strategies for the AI system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This section covers the development process. Key activities include setting up the development environment, defining coding standards, managing dependencies, versioning models, defining a testing approach, and implementing security controls.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <DevelopmentForm />
    </div>
  );
}
