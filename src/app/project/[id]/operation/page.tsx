import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { OperationForm } from "@/app/components/operation-form";

export default function OperationPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Operation Phase (ISO 42001 §8.7)</CardTitle>
          <CardDescription>Document the operational procedures for monitoring, incident handling, and model updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This section outlines how the AI system is managed in a production environment. Key aspects include procedures for ongoing monitoring, detecting performance or data drift, handling incidents, managing model updates, and collecting user feedback.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <OperationForm />
    </div>
  );
}
