import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { RetirementForm } from "@/app/components/retirement-form";

export default function RetirementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Retirement Phase (ISO 42001 §8.8)</CardTitle>
          <CardDescription>Document the plan for system retirement, data migration, and user communication.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This final section outlines the plan for decommissioning the AI system. Key elements include the retirement strategy, plans for data migration or destruction, and how the retirement will be communicated to users and stakeholders.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <RetirementForm />
    </div>
  );
}
