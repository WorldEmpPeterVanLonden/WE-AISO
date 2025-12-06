'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Basic Info section of a project.
 *
 * - generateBasicInfoSuggestions - A function that generates suggestions for business context, legal requirements, and data categories.
 */

import { ai } from '@/ai/genkit';
import { 
    BasicInfoSuggestionsInputSchema, 
    BasicInfoSuggestionsOutputSchema, 
    type BasicInfoSuggestionsInput, 
    type BasicInfoSuggestionsOutput 
} from '@/ai/schemas/basic-info-suggestions';

export async function generateBasicInfoSuggestions(input: BasicInfoSuggestionsInput): Promise<BasicInfoSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'basicInfoSuggestionsPrompt',
    input: { schema: BasicInfoSuggestionsInputSchema },
    output: { schema: BasicInfoSuggestionsOutputSchema },
    prompt: `You are an AI compliance assistant. Based on the provided project details, generate concise and relevant suggestions for the 'Basic Info' section.

    Project Name: {{{projectName}}}
    Use Case: {{{useCase}}}
    Intended Users: {{{intendedUsers}}}
    Geographic Scope: {{{geographicScope}}}

    Generate suggestions for the following fields:
    1.  **Business Context**: Briefly describe the business goal or problem the AI system addresses.
    2.  **Legal Requirements**: List the most likely legal and regulatory frameworks that apply (e.g., GDPR, AI Act, MDR).
    3.  **Data Categories**: Suggest a list of data categories that are likely to be processed. Use generic but descriptive terms.

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
