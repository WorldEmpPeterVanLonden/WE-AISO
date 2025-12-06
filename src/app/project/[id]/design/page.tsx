import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DesignForm } from "@/app/components/design-form";

export default function DesignPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Design Phase (ISO 42001 §8.2)</CardTitle>
          <CardDescription>Document the design of the AI system, including requirements, architecture, and explainability strategies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This section addresses the requirements for the design and development of AI systems. Key considerations include defining functional and non-functional requirements, making explicit design choices about models and data, summarizing the system architecture, and establishing a strategy for explainability.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <DesignForm />
    </div>
  );
}
