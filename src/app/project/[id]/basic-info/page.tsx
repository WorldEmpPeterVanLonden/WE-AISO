import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BasicInfoForm } from "@/app/components/basic-info-form";

export default function BasicInfoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Details about the project's context and scope.</CardDescription>
      </CardHeader>
      <CardContent>
        <BasicInfoForm />
      </CardContent>
    </Card>
  );
}
