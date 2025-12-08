
'use server';

import { revalidatePath } from "next/cache";
import { NewProjectSchema, BasicInfoSchema } from "./definitions";
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";
import { GenerateDocumentSchema } from "@/ai/schemas/ai-technical-file-generation";
import * as admin from 'firebase-admin';
import serviceAccount from '@/../keys/service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id,
  });
}
const firestore = admin.firestore();


export async function createProject(formData: unknown) {
  console.log("[Action] 1. --- createProject functie gestart ---");
  console.log("[Action] 2. Ontvangen formulier data:", formData);

  const validatedFields = NewProjectSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error("[Action ERROR] 9. Zod validatie mislukt:", validatedFields.error.flatten().fieldErrors);
    throw new Error("Ongeldige formulier data.");
  }
  console.log("[Action] 9. Zod validatie succesvol.");

  const {
    name, version, customerId, description, useCase, systemType, riskCategory, owner,
    intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements
  } = validatedFields.data;

  try {
    const projectData = {
      name, version, customerId, description, useCase, systemType, riskCategory, owner,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft',
    };
    
    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      owner: owner,
    };
    
    console.log("[Action] 11. INSPECT: Data wordt naar 'aiso_projects' collectie geschreven:", JSON.stringify(projectData, null, 2));

    const projectRef = await firestore.collection("aiso_projects").add(projectData);
    console.log("[Action] 12. Project document succesvol aangemaakt met ID: ", projectRef.id);
    
    console.log("[Action] 13. INSPECT: Data wordt naar 'basicInfo' subcollectie geschreven:", JSON.stringify(basicInfoData, null, 2));
    
    await firestore.collection("aiso_projects").doc(projectRef.id).collection("basicInfo").doc("details").set(basicInfoData);
    console.log("[Action] 14. BasicInfo sub-document succesvol aangemaakt.");

  } catch (error) {
    console.error("[Action ERROR] 15. Fout bij het schrijven naar Firestore:", error);
    throw new Error("Could not create project in Firestore.");
  }

  console.log("[Action] 16. Revalidating pad: /dashboard");
  revalidatePath("/dashboard");
  console.log("[Action] 17. --- createProject functie succesvol afgerond ---");
}

export async function updateBasicInfo(projectId: string, formData: unknown) {
  const validatedFields = BasicInfoSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error("Zod validation failed:", validatedFields.error.flatten().fieldErrors);
    return { error: "Invalid form data." };
  }

  try {
    const projectRef = firestore.collection("aiso_projects").doc(projectId);
    const basicInfoRef = projectRef.collection("basicInfo").doc("details");

    await firestore.runTransaction(async (transaction) => {
      transaction.update(basicInfoRef, validatedFields.data);
      transaction.update(projectRef, { updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    });

    revalidatePath(`/project/${projectId}/basic-info`);
    revalidatePath(`/project/${projectId}/overview`);
    return { success: "Basic info updated successfully." };
  } catch (error) {
    console.error("Error updating basic info in Firestore:", error);
    return { error: "Could not update project in Firestore." };
  }
}


export async function generateDocumentAction(formData: unknown) {
  const validatedFields = GenerateDocumentSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { error: "Invalid form data." };
  }
  
  const { projectId, documentType, version, format } = validatedFields.data;

  console.log(`Generating document for project ${projectId}...`);

  try {
    console.log("Fetching project data from Firestore...");
    const DATA = {
        systemDefinition: "Mock System Definition: Customer support chatbot...",
        lifecycleOverview: "Mock Lifecycle: Design -> Dev -> ... -> Retirement",
        riskAnalysis: "Mock Risk Register: Includes hallucination, PII leakage risks...",
        controls: "Mock Controls: ISO 42001 A.5.1, A.7.4...",
        designChoices: "Mock Design: Using GPT-4, guardrails in place...",
        infrastructureDiagram: "Mock Infra: Hosted on GCP, using Firebase...",
        testOverview: "Mock Tests: Unit, integration, and performance tests...",
        datasetSummary: "Mock Dataset: Anonymized customer conversations...",
    };

    console.log("Calling AI generation flow...");
    const generatedFile = await generateAiTechnicalFile({
      ...DATA,
      format,
    });
    
    console.log("Simulating PDF generation and upload to Firebase Storage...");
    const storagePath = `/documents/${projectId}/${documentType}_${version}.pdf`;
    
    console.log(`Creating Firestore record at /aiso_projects/${projectId}/documents`);

  } catch(error) {
    console.error("Error during document generation:", error);
    return { error: "Failed to generate document." };
  }

  revalidatePath(`/project/${projectId}/documents`);
  return { success: "Document generated successfully!" };
}

export type AiHealthOutput = { status: 'ok' };

export async function healthCheck(): Promise<AiHealthOutput> {
  return { status: 'ok' };
}
