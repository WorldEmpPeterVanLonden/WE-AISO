'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Basic Info section of a project.
 *
 * - generateBasicInfoSuggestions - A function that generates suggestions for business context, legal requirements, and data categories.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const BasicInfoSuggestionsInputSchema = z.object({
  projectName: z.string().describe('The name of the AI project.'),
  useCase: z.string().describe('The primary use case of the AI system.'),
  intendedUsers: z.string().describe('The intended users of the system.'),
  geographicScope: z.string().describe('The geographic scope where the system will be used (e.g., EU, USA, Global).'),
});
export type BasicInfoSuggestionsInput = z.infer<typeof BasicInfoSuggestionsInputSchema>;

export const BasicInfoSuggestionsOutputSchema = z.object({
    businessContext: z.string().describe("A suggested business context for the project."),
    legalRequirements: z.string().describe("A suggestion for applicable legal requirements (e.g., GDPR, AI Act)."),
    dataCategories: z.array(z.string()).describe("A list of suggested data categories that might be processed."),
});
export type BasicInfoSuggestionsOutput = z.infer<typeof BasicInfoSuggestionsOutputSchema>;


export async function generateBasicInfoSuggestions(input: BasicInfoSuggestionsInput): Promise<BasicInfoSuggestionsOutput> {
  return basicInfoSuggestionsFlow(input);
}

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

const basicInfoSuggestionsFlow = ai.defineFlow(
  {
    name: 'basicInfoSuggestionsFlow',
    inputSchema: BasicInfoSuggestionsInputSchema,
    outputSchema: BasicInfoSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
