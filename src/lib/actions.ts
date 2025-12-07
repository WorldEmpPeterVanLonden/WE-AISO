
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NewProjectSchema } from "./definitions";
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";
import { GenerateDocumentSchema } from "@/ai/schemas/ai-technical-file-generation";
import { getApps, initializeApp, type App, getApp } from "firebase-admin/app";
import { getFirestore, serverTimestamp } from "firebase-admin/firestore";


export async function createProject(formData: unknown) {
  console.log("[Action] createProject received data:", formData);

  // Initialize Firebase Admin SDK inside the function
  let app: App;
  if (!getApps().length) {
    console.log("[Action DEBUG] Initializing Firebase Admin SDK...");
    app = initializeApp();
    console.log("[Action DEBUG] Firebase Admin SDK initialized.");
  } else {
    console.log("[Action DEBUG] Re-using existing Firebase Admin SDK app instance.");
    app = getApp();
  }
  const firestore = getFirestore(app);
  console.log("[Action DEBUG] Firestore instance obtained.");


  const validatedFields = NewProjectSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error("[Action] Zod validation failed:", validatedFields.error.flatten().fieldErrors);
    throw new Error("Invalid form data.");
  }
  console.log("[Action] Zod validation successful:", validatedFields.data);
  
  const {
    name, version, customerId, description, useCase, systemType, riskCategory, owner,
    intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements
  } = validatedFields.data;
  
  try {
    console.log("[Action DEBUG] Entering try block to create project.");
    const projectData = {
      name, version, customerId, description, useCase, systemType, riskCategory, owner,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'draft',
    };
    console.log("[Action DEBUG] Project data object prepared:", projectData);
    const projectRef = await firestore.collection("aiso_projects").add(projectData);
    console.log("[Action DEBUG] Project document created successfully with ID: ", projectRef.id);
    
    // Add the owner to the basicInfoData to satisfy security rules on create.
    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      owner: owner, // Ensure owner is present for the security rule check
    };
    
    console.log("[Action DEBUG] BasicInfo data object prepared:", basicInfoData);
    // Use a specific doc ID for the singleton basic info document.
    await firestore.collection("aiso_projects").doc(projectRef.id).collection("basicInfo").doc("details").set(basicInfoData);
    console.log("[Action DEBUG] BasicInfo sub-document created successfully.");
    
  } catch (error) {
    console.error("[Action] Error creating project in Firestore:", error);
    throw new Error("Could not create project in Firestore.");
  }

  revalidatePath("/dashboard");
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
    // TODO: 1. Fetch all data from Firestore 
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

    // 2. Call the AI flow
    console.log("Calling AI generation flow...");
    const generatedFile = await generateAiTechnicalFile({
      ...DATA,
      format,
    });
    
    // 3. (Future) Generate PDF and save to Firebase Storage
    console.log("Simulating PDF generation and upload to Firebase Storage...");
    const storagePath = `/documents/${projectId}/${documentType}_${version}.pdf`;
    
    // 4. (Future) Create a record in Firestore
    console.log(`Creating Firestore record at /aiso_projects/${projectId}/documents`);

  } catch(error) {
    console.error("Error during document generation:", error);
    return { error: "Failed to generate document." };
  }

  revalidatePath(`/project/${projectId}/documents`);
  return { success: "Document generated successfully!" };
}

export type AiHealthOutput = { status: 'ok' };

/**
 * A simple health check function to verify that the server action endpoint is reachable.
 * @returns A promise that resolves to an object with a status of 'ok'.
 */
export async function healthCheck(): Promise<AiHealthOutput> {
  return { status: 'ok' };
}
