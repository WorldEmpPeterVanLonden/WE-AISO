import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BasicInfoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Details about the project's context and scope.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the basic info page. Form to edit details will be here.</p>
      </CardContent>
    </Card>
  );
}
