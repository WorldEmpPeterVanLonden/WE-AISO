
'use server';

import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";
import {
  ProjectSuggestionsInputSchema,
  ProjectSuggestionsOutputSchema,
  type ProjectSuggestionsInput,
  type ProjectSuggestionsOutput,
} from "@/ai/schemas/project-suggestions";

export async function generateProjectSuggestions(
  input: ProjectSuggestionsInput
): Promise<ProjectSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: "projectSuggestionsPrompt",
    input: { schema: ProjectSuggestionsInputSchema },
    output: { schema: ProjectSuggestionsOutputSchema },
    model: googleAI.model("gemini-2.5-flash"),
    prompt: `
      You are an expert AI project manager.
      Based on the provided use case, generate:
      - a concise project name
      - a one-sentence description

      Use Case: {{{useCase}}}

      Return valid JSON according to the schema.
    `,
    config: {
      temperature: 0.1,
    }
  });

  const { output } = await prompt(input);
  if (!output) {
    throw new Error("Failed to get suggestions from AI.");
  }
  return output;
}
