
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BasicInfoForm } from "@/app/components/basic-info-form";

import { adminDb } from "@/firebase/admin";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BasicInfoSchema } from "@/lib/definitions";

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

async function getProjectBasicInfo(projectId: string): Promise<BasicInfoFormData> {
  const docRef = adminDb
    .collection("aiso_projects")
    .doc(projectId)
    .collection("basicInfo")
    .doc("details");

  const snap = await docRef.get();

  if (!snap.exists) {
    // Return a default structure if no data exists yet
    return {
      businessContext: "",
      intendedUsers: [],
      geographicScope: "EU",
      legalRequirements: [],
      dataCategories: [],
      dataSources: [],
      externalDependencies: [],
      stakeholders: "",
      prohibitedUse: "",
      retentionPolicy: "",
      operationalEnvironment: "",
      performanceGoals: "",
      scopeComponents: "",
      dataSubjects: [],
      dataSensitivity: "internal",
      aiActClassification: "limited",
    };
  }
  
  // Ensure array fields are arrays
  const data = snap.data() as any;
  const ensureArray = (field: any) => Array.isArray(field) ? field : (field ? [field] : []);

  return {
    ...data,
    intendedUsers: ensureArray(data.intendedUsers),
    legalRequirements: ensureArray(data.legalRequirements),
    dataCategories: ensureArray(data.dataCategories),
    dataSources: ensureArray(data.dataSources),
    externalDependencies: ensureArray(data.externalDependencies),
    dataSubjects: ensureArray(data.dataSubjects),
  };
}

export default async function BasicInfoPage({ params }: { params: { id: string } }) {
  const defaultValues = await getProjectBasicInfo(params.id);

  if (!defaultValues) return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Details about the project's context and scope.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <BasicInfoForm defaultValues={defaultValues} />
      </CardContent>
    </Card>
  );
}
