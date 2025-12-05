import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OverviewPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>A high-level summary of the project.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the project overview page. More details will be displayed here soon.</p>
      </CardContent>
    </Card>
  );
}
