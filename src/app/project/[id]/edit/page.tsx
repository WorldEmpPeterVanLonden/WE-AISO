
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
    createdAt?: Timestamp | string;
    updatedAt?: Timestamp | string;
};

async function getProjectDetails(projectId: string): Promise<ProjectFormDataForClient | null> {
  const docRef = adminDb.collection("aiso_projects").doc(projectId);
  const snap = await docRef.get();

  if (!snap.exists) {
    return null;
  }

  const data = snap.data() as ProjectDataFromFirestore;

  // Convert Timestamp objects to ISO strings for serialization, only if they are not already strings
  const convertTimestampToString = (ts: any) => {
    if (typeof ts === 'string') {
      return ts; // Already a string, return as is
    }
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toISOString();
    }
    return undefined;
  };

  return {
    ...data,
    createdAt: convertTimestampToString(data.createdAt),
    updatedAt: convertTimestampToString(data.updatedAt),
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
