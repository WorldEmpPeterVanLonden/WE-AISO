
'use server';

import { revalidatePath } from "next/cache";
import { NewProjectSchema, BasicInfoSchema } from "./definitions";
import { GenerateDocumentSchema } from "@/ai/schemas/ai-technical-file-generation";
import { adminDb } from "@/firebase/admin";
import * as admin from 'firebase-admin';
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";


export async function createProject(formData: unknown) {
  const validatedFields = NewProjectSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error("[Action ERROR] Zod validation failed:", validatedFields.error.flatten().fieldErrors);
    return { error: "Invalid form data. Please check the fields and try again." };
  }
  
  const {
    name, version, customerId, description, useCase, systemType, riskCategory, owner,
    intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements
  } = validatedFields.data;
  
  try {
    const projectRef = adminDb.collection("aiso_projects").doc();
    
    const projectData = {
      name, version, customerId, description, useCase, systemType, riskCategory, owner,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft',
    };
    
    // The wizard now collects this data, so we save it immediately
    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      owner: owner,
      businessContext: description, // Use project description as initial business context
    };
    
    const batch = adminDb.batch();
    
    batch.set(projectRef, projectData);
    
    const basicInfoRef = projectRef.collection("basicInfo").doc("details");
    batch.set(basicInfoRef, basicInfoData, { merge: true });

    await batch.commit();
    
    revalidatePath("/dashboard");
    return { success: true, projectId: projectRef.id };

  } catch (error) {
    console.error("[Action ERROR] Error writing to Firestore:", error);
    return { error: "Could not create project in Firestore." };
  }
}

export async function updateProject(projectId: string, formData: unknown) {
  const validatedFields = NewProjectSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error("Zod validation failed for updateProject:", validatedFields.error.flatten().fieldErrors);
    return { error: "Invalid form data for updating project." };
  }
  
  const {
    name, version, customerId, description, useCase, systemType, riskCategory,
    intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements
  } = validatedFields.data;

  try {
    const projectRef = adminDb.collection("aiso_projects").doc(projectId);
    const basicInfoRef = projectRef.collection("basicInfo").doc("details");

    const projectData = {
      name, version, customerId, description, useCase, systemType, riskCategory,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      businessContext: description,
    };
    
    const batch = adminDb.batch();
    batch.update(projectRef, projectData);
    batch.set(basicInfoRef, basicInfoData, { merge: true });
    await batch.commit();

    revalidatePath(`/project/${projectId}/edit`);
    revalidatePath(`/project/${projectId}/overview`);
    revalidatePath('/dashboard');
    return { success: "Project details updated successfully." };
  } catch (error) {
    console.error("Error updating project in Firestore:", error);
    return { error: "Could not update project in Firestore." };
  }
}

export async function updateBasicInfo(projectId: string, formData: unknown) {
  const validatedFields = BasicInfoSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error("Zod validation failed for updateBasicInfo:", validatedFields.error.flatten().fieldErrors);
    return { error: "Invalid form data." };
  }

  try {
    const projectRef = adminDb.collection("aiso_projects").doc(projectId);
    const basicInfoRef = projectRef.collection("basicInfo").doc("details");

    await adminDb.runTransaction(async (transaction) => {
      transaction.set(basicInfoRef, validatedFields.data, { merge: true });
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

export type AiHealthOutput = { status: 'ok' | 'error', message?: string };

export async function healthCheck(): Promise<AiHealthOutput> {
  console.log('--- Running AI Health Check ---');
  try {
    const projectId = process.env.VERTEX_PROJECT || 'Not Set';
    const location = process.env.VERTEX_LOCATION || 'Not Set';
    const model = process.env.VERTEX_MODEL || 'Not Set';

    console.log(`Project ID:   ${projectId}`);
    console.log(`Location:     ${location}`);
    console.log(`Model:        ${model}`);

    console.log('Genkit config OK');
    console.log('-----------------------------');
    return { status: 'ok' };
  } catch (error: any) {
    console.error('AI Health Check failed:', error.message);
    console.log('-----------------------------');
    return { status: 'error', message: error.message };
  }
}
