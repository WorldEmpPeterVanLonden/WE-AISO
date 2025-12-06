import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DeploymentForm } from "@/app/components/deployment-form";

export default function DeploymentPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deployment Phase (ISO 42001 §8.6)</CardTitle>
          <CardDescription>Document the deployment infrastructure, CI/CD pipeline, and operational readiness of the AI system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This section outlines the process for deploying the AI system. Key elements include detailing the infrastructure, the CI/CD pipeline for automated deployment, access control mechanisms, logging and monitoring policies, and how secrets are managed.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <DeploymentForm />
    </div>
  );
}
