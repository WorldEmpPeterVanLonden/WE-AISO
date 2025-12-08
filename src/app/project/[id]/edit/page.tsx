
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EditProjectForm } from "@/app/components/edit-project-form";
import { adminDb } from "@/firebase/admin";
import { notFound } from "next/navigation";
import type { z } from "zod";
import { ProjectSchema } from "@/lib/definitions";
import type { Timestamp } from "firebase-admin/firestore";

// This will be the type passed to the client component, with strings for dates
type ProjectFormDataForClient = Omit<z.infer<typeof ProjectSchema>, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};

// This is the type we get from Firestore, with Timestamps
type ProjectDataFromFirestore = Omit<ProjectFormDataForClient, 'createdAt' | 'updatedAt'> & {
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

async function getProjectDetails(projectId: string): Promise<ProjectFormDataForClient | null> {
  const docRef = adminDb.collection("aiso_projects").doc(projectId);
  const snap = await docRef.get();

  if (!snap.exists) {
    return null;
  }

  const data = snap.data() as ProjectDataFromFirestore;

  // Convert Timestamp objects to ISO strings for serialization
  return {
    ...data,
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString(),
  };
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
