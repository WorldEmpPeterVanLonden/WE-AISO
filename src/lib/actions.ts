
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { NewProjectSchema } from "./definitions";
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";
import { GenerateDocumentSchema } from "@/ai/schemas/ai-technical-file-generation";
import { getFirebase } from "@/firebase/server";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";

export async function createProject(formData: unknown) {

  const validatedFields = NewProjectSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    throw new Error("Invalid form data.");
  }
  
  const {
    name, version, customerId, description, useCase, systemType, riskCategory, owner,
    intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements
  } = validatedFields.data;

  const { firestore } = await getFirebase();
  
  try {
    const projectData = {
      name, version, customerId, description, useCase, systemType, riskCategory, owner,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'draft',
    };
    const projectRef = await addDoc(collection(firestore, "projects"), projectData);
    
    // Add the owner to the basicInfoData to satisfy security rules on create.
    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      owner: owner, // Ensure owner is present for the security rule check
    };
    
    // Use a specific doc ID for the singleton basic info document.
    await setDoc(doc(firestore, "projects", projectRef.id, "basicInfo", "details"), basicInfoData);
    
    console.log("Project created successfully with ID: ", projectRef.id);
    
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Could not create project in Firestore.");
  }

  revalidatePath("/dashboard");
  // Do not redirect here, let the client handle it upon success.
  // redirect("/dashboard");
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
    console.log(`Creating Firestore record at /projects/${projectId}/documents`);

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
