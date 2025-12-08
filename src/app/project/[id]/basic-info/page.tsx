
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BasicInfoForm } from "@/app/components/basic-info-form";
import { getFirebase } from "@/firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BasicInfoSchema } from "@/lib/definitions";

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

async function getProjectBasicInfo(projectId: string): Promise<BasicInfoFormData> {
    const { firestore } = await getFirebase();
    const docRef = doc(firestore, "aiso_projects", projectId, "basicInfo", "details");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        // Return default empty state if no document exists yet
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
        };
    }
    
    // We can use safeParse to be sure, but for now we'll assume the data is correct.
    return docSnap.data() as BasicInfoFormData;
}

export default async function BasicInfoPage({ params }: { params: { id: string } }) {
  const defaultValues = await getProjectBasicInfo(params.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Details about the project's context and scope.</CardDescription>
      </CardHeader>
      <CardContent>
        <BasicInfoForm defaultValues={defaultValues} />
      </CardContent>
    </Card>
  );
}
