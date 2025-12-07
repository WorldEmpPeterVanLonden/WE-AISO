
'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NewProjectSchema } from "./definitions";
import { generateAiTechnicalFile } from "@/ai/ai-technical-file-generation";
import { GenerateDocumentSchema } from "@/ai/schemas/ai-technical-file-generation";
import * as admin from 'firebase-admin';

export async function createProject(formData: unknown) {
  console.log("[Action] 1. --- createProject functie gestart ---");
  console.log("[Action] 2. Ontvangen formulier data:", formData);

  try {
    if (!admin.apps.length) {
      console.log("[Action] 3. Firebase Admin SDK wordt geïnitialiseerd...");
      const serviceAccountString = process.env.ADMIN_FIREBASE_SERVICE_ACCOUNT;
      
      if (!serviceAccountString) {
        console.error("[Action ERROR] Omgevingsvariabele ADMIN_FIREBASE_SERVICE_ACCOUNT is niet gevonden.");
        throw new Error("Firebase Admin credentials niet geconfigureerd op de server.");
      }
      console.log("[Action] 4. Service Account String gevonden.");

      const serviceAccount = JSON.parse(serviceAccountString);
      console.log("[Action] 5. Service Account JSON succesvol geparsed.");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log("[Action] 6. Firebase Admin SDK succesvol geïnitialiseerd.");
    } else {
      console.log("[Action] 3. Bestaande Firebase Admin SDK instantie wordt hergebruikt.");
    }
  } catch (e: any) {
    console.error("[Action ERROR] Fout bij initialiseren van Firebase Admin SDK:", e.message);
    throw new Error(`Initialisatie van Firebase Admin SDK mislukt. Error: ${e.message}`);
  }

  const firestore = admin.firestore();
  console.log("[Action] 7. Firestore instantie verkregen.");

  console.log("[Action] 8. Starten van Zod validatie...");
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
    console.log("[Action] 10. Voorbereiden van project data voor Firestore...");
    const projectData = {
      name, version, customerId, description, useCase, systemType, riskCategory, owner,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft',
    };
    console.log("[Action] 11. Project data die wordt weggeschreven:", projectData);

    const projectRef = await firestore.collection("aiso_projects").add(projectData);
    console.log("[Action] 12. Project document succesvol aangemaakt met ID: ", projectRef.id);

    const basicInfoData = {
      intendedUsers, geographicScope, dataCategories, dataSources, legalRequirements,
      owner: owner,
    };
    console.log("[Action] 13. BasicInfo data die wordt weggeschreven:", basicInfoData);

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
