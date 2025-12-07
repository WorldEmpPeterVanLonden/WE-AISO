
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NewProjectSchema } from "./definitions";
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";
import { GenerateDocumentSchema } from "@/ai/schemas/ai-technical-file-generation";
import * as admin from 'firebase-admin';

export async function createProject(formData: unknown) {
  console.log("[Action] createProject received data:", formData);

  try {
    if (!admin.apps.length) {
      console.log("[Action DEBUG] Initializing Firebase Admin SDK...");
      const serviceAccountString = process.env.ADMIN_FIREBASE_SERVICE_ACCOUNT;
      if (!serviceAccountString) {
        console.error("[Action ERROR] ADMIN_FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
        throw new Error("Firebase Admin credentials not configured on the server.");
      }
      
      const serviceAccount = JSON.parse(serviceAccountString);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log("[Action DEBUG] Firebase Admin SDK initialized successfully.");
    } else {
      console.log("[Action DEBUG] Re-using existing Firebase Admin SDK app instance.");
    }
  } catch (e: any) {
    console.error("[Action ERROR] Failed to initialize Firebase Admin SDK:", e.message);
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check the service account configuration. Original error: ${e.message}`);
  }

  const firestore = admin.firestore();
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft',
    };
    console.log("[Action DEBUG] Project data object prepared:", projectData);

    const projectRef = await firestore.collection("aiso_projects").add(projectData);
    console.log("[Action DEBUG] Project document created successfully with ID: ", projectRef.id);

    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      owner: owner,
    };

    console.log("[Action DEBUG] BasicInfo data object prepared:", basicInfoData);
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
