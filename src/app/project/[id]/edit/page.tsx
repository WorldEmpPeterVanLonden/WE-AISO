
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EditProjectForm } from "@/app/components/edit-project-form";
import { adminDb } from "@/firebase/admin";
import { notFound } from "next/navigation";
import type { z } from "zod";
import { ProjectSchema } from "@/lib/definitions";

type ProjectFormData = z.infer<typeof ProjectSchema>;

async function getProjectDetails(projectId: string): Promise<ProjectFormData | null> {
  const docRef = adminDb.collection("aiso_projects").doc(projectId);
  const snap = await docRef.get();

  if (!snap.exists) {
    return null;
  }

  return snap.data() as ProjectFormData;
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projectData = await getProjectDetails(params.id);

  if (!projectData) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Edit the core details of your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EditProjectForm defaultValues={projectData} projectId={params.id} />
      </CardContent>
    </Card>
  );
}
