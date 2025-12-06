
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ProjectSchema, BasicInfoSchema, GenerateDocumentSchema } from "./definitions";
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";

// This is a mock function. Replace with actual Firebase calls.
async function createProjectInFirestore(
  projectData: z.infer<typeof ProjectSchema>,
  basicInfoData: z.infer<typeof BasicInfoSchema>
) {
  console.log("Creating project with data:", projectData);
  console.log("Adding basic info:", basicInfoData);

  // Here you would typically use the Firebase Admin SDK to create documents
  // For example:
  // const { getFirestore } = require('firebase-admin/firestore');
  // const db = getFirestore();
  // const projectRef = await db.collection('projects').add({
  //   ...projectData,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   owner: 'mock-user', // Replace with actual user
  //   status: 'draft',
  // });
  //
  // await db.collection('projects').doc(projectRef.id).collection('basicInfo').add({
  //  ...basicInfoData
  // });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("Project created successfully (mock)");
  return { id: "mock-project-id" };
}


export async function createProject(formData: unknown) {
  
  const combinedSchema = ProjectSchema.extend({
    intendedUsers: BasicInfoSchema.shape.intendedUsers,
    geographicScope: BasicInfoSchema.shape.geographicScope,
    dataCategories: BasicInfoSchema.shape.dataCategories,
    dataSources: BasicInfoSchema.shape.dataSources,
    legalRequirements: BasicInfoSchema.shape.legalRequirements,
  });

  const validatedFields = combinedSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    throw new Error("Invalid form data.");
  }

  const { data } = validatedFields;
  
  const projectData: z.infer<typeof ProjectSchema> = {
      name: data.name,
      version: data.version,
      customerId: data.customerId,
      description: data.description,
      useCase: data.useCase,
      systemType: data.systemType,
      riskCategory: data.riskCategory,
  }

  const basicInfoData: Partial<z.infer<typeof BasicInfoSchema>> = {
      intendedUsers: data.intendedUsers,
      geographicScope: data.geographicScope,
      legalRequirements: data.legalRequirements,
      dataCategories: data.dataCategories,
      dataSources: typeof data.dataSources === 'string' ? data.dataSources.split(',').map(s => s.trim()) : [],
  }

  try {
    // We are not using Firestore yet, so this is commented out.
    // await createProjectInFirestore(projectData, basicInfoData);
    console.log("Mock project creation successful.");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create project.");
  }

  revalidatePath("/");
  redirect("/");
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
    // 1. Fetch all data from Firestore (mocked for now)
    console.log("Fetching project data from Firestore...");
    const MOCK_DATA = {
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
      ...MOCK_DATA,
      format,
    });
    
    // 3. (Future) Generate PDF and save to Firebase Storage
    console.log("Simulating PDF generation and upload to Firebase Storage...");
    const mockStoragePath = `/documents/${projectId}/${documentType}_${version}.pdf`;
    console.log("Generated text content:", generatedFile.technicalFile.substring(0, 200) + "...");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

    // 4. (Future) Create a record in Firestore
    console.log(`Creating Firestore record at /projects/${projectId}/documents`);
    const newDocumentRecord = {
        type: documentType,
        title: `${documentType.replace(/([A-Z])/g, ' $1').trim()} v${version}`,
        createdAt: new Date().toISOString(),
        generatedBy: "system", // or current user
        storagePath: mockStoragePath,
        version: version,
    };
    console.log("New document record:", newDocumentRecord);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB write

  } catch(error) {
    console.error("Error during document generation:", error);
    return { error: "Failed to generate document." };
  }

  revalidatePath(`/project/${projectId}/documents`);
  return { success: "Document generated successfully!" };
}
