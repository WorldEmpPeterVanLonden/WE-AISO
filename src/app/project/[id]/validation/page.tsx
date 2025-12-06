import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ValidationForm } from "@/app/components/validation-form";

export default function ValidationPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validation Phase (ISO 42001 §8.5)</CardTitle>
          <CardDescription>Document the validation methods, criteria, and results for the AI system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This section covers the validation of the AI system. It's crucial to define the validation methods, acceptance criteria, and how the system is tested for robustness and edge cases. Document the results and any independent reviews conducted.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <ValidationForm />
    </div>
  );
}
