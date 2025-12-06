import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { TrainingForm } from "@/app/components/training-form";

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Training Phase (ISO 42001 §8.4)</CardTitle>
          <CardDescription>Document the data sourcing, collection, and preparation activities for model training.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ISO 42001 Requirements</AlertTitle>
            <AlertDescription>
              <p>This section addresses the requirements for data handling during the AI system's lifecycle, particularly for training. Key aspects include describing the dataset, its sources, data quality procedures, and assessments for bias and privacy. If your model is pre-trained and does not require a fine-tuning or training phase, you can indicate this below.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <TrainingForm />
    </div>
  );
}
