'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Design phase of a project.
 *
 * - generateDesignSuggestions - A function that generates suggestions for design requirements.
 */

import { ai } from '@/ai/genkit';
import { 
    DesignSuggestionsInputSchema, 
    DesignSuggestionsOutputSchema, 
    type DesignSuggestionsInput, 
    type DesignSuggestionsOutput 
} from '@/ai/schemas/design-suggestions';

export async function generateDesignSuggestions(input: DesignSuggestionsInput): Promise<DesignSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'designSuggestionsPrompt',
    input: { schema: DesignSuggestionsInputSchema },
    output: { schema: DesignSuggestionsOutputSchema },
    prompt: `You are an AI System Architect. Based on the project use case, generate suggestions for the design phase.

    Use Case: {{{useCase}}}

    Generate clear and concise suggestions for the following fields:
    1.  **Functional Requirements**: What the system must do.
    2.  **Non-Functional Requirements**: How the system must perform (e.g., performance, security).
    3.  **Design Choices**: High-level decisions (e.g., model type, key libraries).
    4.  **Data Architecture**: How data will be handled and stored.
    5.  **Explainability Strategy**: How to make the model's decisions understandable.

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
