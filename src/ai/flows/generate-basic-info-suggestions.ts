
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
  const promptText = () => {
    switch (input.targetField) {
      case 'businessContext':
        return 'Generate a concise suggestion for the "Business Context" of the project. Describe the primary business goal or problem the AI system addresses.';
      case 'stakeholders':
        return 'Generate a list of 3-5 likely key stakeholders for this project (e.g., Product Owner, Legal Department, Data Protection Officer).';
      case 'prohibitedUse':
        return 'Generate a suggestion for a "Prohibited Use" clause, stating what the system must not be used for (e.g., financial advice, medical diagnosis).';
      case 'scopeComponents':
        return 'Generate a suggestion for "In-scope / Out-of-scope Components", clearly defining what is and is not part of the AI system (e.g., In-scope: the model API. Out-of-scope: the front-end application.)';
      default:
        return `You are an AI compliance assistant. Based on the provided project details, generate concise and relevant suggestions for the 'Basic Info' section.

        Generate suggestions for the following fields:
        1.  **Business Context**: Briefly describe the business goal or problem the AI system addresses.
        2.  **Legal Requirements**: List the most likely legal and regulatory frameworks that apply (e.g., GDPR, AI Act, MDR).
        3.  **Data Categories**: Suggest a list of data categories that are likely to be processed. Use generic but descriptive terms.`;
    }
  };

  const prompt = ai.definePrompt({
    name: 'basicInfoSuggestionsPrompt',
    input: { schema: BasicInfoSuggestionsInputSchema },
    output: { schema: BasicInfoSuggestionsOutputSchema },
    model: process.env.VERTEX_MODEL || "gemini-1.5-flash-001",
    prompt: `
      Project Name: {{{projectName}}}
      Use Case: {{{useCase}}}
      Intended Users: {{{intendedUsers}}}
      Geographic Scope: {{{geographicScope}}}
    
    ${promptText()}

    Provide the output in the requested JSON format. For single field requests, only populate that field in the output.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
