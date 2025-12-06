import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { GovernanceForm } from "@/app/components/governance-form";

export default function GovernancePage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
            <CardTitle>Governance (ISO 42001 §6, §7)</CardTitle>
            <CardDescription>Define the governance structure, roles, and change management processes for the AI system.</CardDescription>
        </CardHeader>
        <CardContent>
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>ISO 42001 Requirements</AlertTitle>
                <AlertDescription>
                <p>This section addresses organizational governance and accountability. Key elements include defining roles and responsibilities, establishing processes for change management and documentation versioning, and outlining audit and quality control requirements. The AI can assist in suggesting relevant ISO controls to map to your processes.</p>
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
    <GovernanceForm />
    </div>
  );
}
