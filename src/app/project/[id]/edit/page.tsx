
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProjectForm } from "@/app/components/project-form";
import { adminDb } from "@/firebase/admin";
import { notFound } from "next/navigation";
import type { z } from "zod";
import { NewProjectSchema } from "@/lib/definitions";
import type { Timestamp } from "firebase-admin/firestore";

type ProjectFormDataForClient = Omit<z.infer<typeof NewProjectSchema>, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};

type ProjectDataFromFirestore = Omit<ProjectFormDataForClient, 'createdAt' | 'updatedAt'> & {
    createdAt?: Timestamp | string;
    updatedAt?: Timestamp | string;
};

async function getProjectDetails(projectId: string): Promise<ProjectFormDataForClient | null> {
  const projectRef = adminDb.collection("aiso_projects").doc(projectId);
  const basicInfoRef = projectRef.collection("basicInfo").doc("details");
  
  const [projectSnap, basicInfoSnap] = await Promise.all([
    projectRef.get(),
    basicInfoRef.get()
  ]);

  if (!projectSnap.exists) {
    return null;
  }

  const projectData = projectSnap.data() as Omit<ProjectDataFromFirestore, 'intendedUsers' | 'geographicScope' | 'dataCategories' | 'dataSources' | 'legalRequirements'>;
  const basicInfoData = basicInfoSnap.exists ? basicInfoSnap.data() as Partial<ProjectDataFromFirestore> : {};

  const combinedData = { ...projectData, ...basicInfoData };

  const convertTimestampToString = (ts: any) => {
    if (typeof ts === 'string') return ts;
    if (ts && typeof ts.toDate === 'function') return ts.toDate().toISOString();
    return undefined;
  };
  
  const ensureArray = (field: any) => Array.isArray(field) ? field : (field ? [field] : []);

  return {
    ...combinedData,
    createdAt: convertTimestampToString(combinedData.createdAt),
    updatedAt: convertTimestampToString(combinedData.updatedAt),
    intendedUsers: ensureArray(combinedData.intendedUsers),
    legalRequirements: ensureArray(combinedData.legalRequirements),
    dataCategories: ensureArray(combinedData.dataCategories),
    dataSources: ensureArray(combinedData.dataSources),
  };
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projectData = await getProjectDetails(params.id);

  if (!projectData) {
    return notFound();
  }

  return (
    <ProjectForm mode="edit" defaultValues={projectData} projectId={params.id} />
  );
}
