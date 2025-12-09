'use server';

import { ai } from "@/ai/genkit";
import { vertexAI } from "@genkit-ai/google-genai";
import {
  ProjectSuggestionsInputSchema,
  ProjectSuggestionsOutputSchema,
  type ProjectSuggestionsInput,
  type ProjectSuggestionsOutput,
} from "@/ai/schemas/project-suggestions";

export async function generateProjectSuggestions(
  input: ProjectSuggestionsInput
): Promise<ProjectSuggestionsOutput> {

  console.log("ENV CHECK VERTEX_MODEL =", process.env.VERTEX_MODEL);
  console.log("ENV CHECK VERTEX_PROJECT =", process.env.VERTEX_PROJECT);
  console.log("ENV CHECK VERTEX_LOCATION =", process.env.VERTEX_LOCATION);

  const modelName = process.env.VERTEX_MODEL ?? "gemini-2.5-flash-001";

  const promptText = `
    You are an expert AI project manager.
    Based on the provided use case, generate:
    - a concise project name
    - a one-sentence description

    Use Case: ${input.useCase}

    Return valid JSON according to the schema.
  `;

  const { text } = await ai.generate({
    model: vertexAI({ 
      projectId: process.env.VERTEX_PROJECT!,
      location: process.env.VERTEX_LOCATION ?? "us-central1",
    }).model(modelName),

    prompt: promptText,
  });

  console.log("RAW AI OUTPUT:", text);

  // parse naar schema
  const parsed = ProjectSuggestionsOutputSchema.parse(JSON.parse(text));
  return parsed;
}
