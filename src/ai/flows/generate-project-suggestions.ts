'use server';

import { ai } from "@/ai/genkit";
import {
  ProjectSuggestionsInputSchema,
  ProjectSuggestionsOutputSchema,
  type ProjectSuggestionsInput,
  type ProjectSuggestionsOutput,
} from "@/ai/schemas/project-suggestions";

// Importeer GEEN 'vertexAI' uit "@genkit-ai/google-genai" meer,
// omdat we deze niet meer handmatig initialiseren.

export async function generateProjectSuggestions(
  input: ProjectSuggestionsInput
): Promise<ProjectSuggestionsOutput> {

  // De modelnaam wordt consistent gelezen uit de environment variabele
  // en is gedefinieerd in .env en apphosting.yaml.
  const modelName = process.env.VERTEX_MODEL ?? "gemini-2.5-flash";

  console.log("ENV CHECK VERTEX_MODEL =", process.env.VERTEX_MODEL);
  console.log("ENV CHECK VERTEX_PROJECT =", process.env.VERTEX_PROJECT);
  console.log("ENV CHECK VERTEX_LOCATION =", process.env.VERTEX_LOCATION);
  console.log("Gebruikt Modelnaam:", modelName);

  const promptText = `
    You are an expert AI project manager.
    Based on the provided use case, generate:
    - a concise project name
    - a one-sentence description

    Use Case: ${input.useCase}

    Return valid JSON according to the schema.
  `;

  // ✅ CORRECTIE: Geef ALLEEN de modelnaam door aan ai.generate().
  // De 'ai' instantie weet al welke provider, project ID en locatie hij moet gebruiken
  // dankzij de logica in src/ai/genkit.ts.
  const { text } = await ai.generate({
    model: modelName, 
    prompt: promptText,
    config: {
        // Voeg optioneel configuratie zoals temperatuur toe
        temperature: 0.1, 
    }
  });

  console.log("RAW AI OUTPUT:", text);

  // parse naar schema
  // De output van Gemini is vaak een string die met een newline begint, 
  // vandaar de .trim() voor JSON.parse
  const parsed = ProjectSuggestionsOutputSchema.parse(JSON.parse(text.trim()));
  return parsed;
}