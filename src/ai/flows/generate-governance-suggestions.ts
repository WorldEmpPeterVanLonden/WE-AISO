'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Governance section.
 *
 * - generateGovernanceSuggestions - A function that suggests relevant ISO 42001 controls.
 */

import { ai } from '@/ai/genkit';
import { 
    GovernanceSuggestionsInputSchema, 
    GovernanceSuggestionsOutputSchema, 
    type GovernanceSuggestionsInput, 
    type GovernanceSuggestionsOutput 
} from '@/ai/schemas/governance-suggestions';

export async function generateGovernanceSuggestions(input: GovernanceSuggestionsInput): Promise<GovernanceSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'governanceSuggestionsPrompt',
    input: { schema: GovernanceSuggestionsInputSchema },
    output: { schema: GovernanceSuggestionsOutputSchema },
    prompt: `You are an AI compliance expert specializing in ISO 42001. 
    Based on the provided use case, suggest a list of the 5 most relevant ISO 42001 Annex A controls.
    For each control, provide the control number and a very brief description.

    Use Case: {{{useCase}}}

    Example format for a control: "A.5.2: Data sourcing"
    
    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
