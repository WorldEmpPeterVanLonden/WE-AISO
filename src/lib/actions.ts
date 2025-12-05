"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ProjectSchema, BasicInfoSchema } from "./definitions";

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
  
  const combinedSchema = ProjectSchema.merge(BasicInfoSchema);
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

  const basicInfoData: z.infer<typeof BasicInfoSchema> = {
      businessContext: "", // Not in form, can be added later
      intendedUsers: data.intendedUsers,
      geographicScope: data.geographicScope,
      legalRequirements: data.legalRequirements,
      dataCategories: data.dataCategories,
      dataSources: data.dataSources ? data.dataSources.split(',').map(s => s.trim()) : [],
      externalDependencies: [], // Not in form
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
  // Redirect is called outside of try/catch to avoid issues.
  // We are not redirecting yet, we stay on the page.
  // redirect("/");
}
