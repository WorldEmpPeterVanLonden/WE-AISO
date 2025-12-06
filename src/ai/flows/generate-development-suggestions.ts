
'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Development phase of a project.
 *
 * - generateDevelopmentSuggestions - A function that generates suggestions for development details.
 */

import { ai } from '@/ai/genkit';
import { 
    DevelopmentSuggestionsInputSchema, 
    DevelopmentSuggestionsOutputSchema, 
    type DevelopmentSuggestionsInput, 
    type DevelopmentSuggestionsOutput 
} from '@/ai/schemas/development-suggestions';

export async function generateDevelopmentSuggestions(input: DevelopmentSuggestionsInput): Promise<DevelopmentSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'developmentSuggestionsPrompt',
    input: { schema: DevelopmentSuggestionsInputSchema },
    output: { schema: DevelopmentSuggestionsOutputSchema },
    prompt: `You are an expert AI DevOps Engineer. Based on the project use case provided, generate detailed suggestions for the development phase of an AI system.

    Use Case: {{{useCase}}}

    Generate clear, concise, and actionable suggestions for the following fields. Use bullet points for lists where appropriate.

    1.  **toolchain**: Suggest a list of 2-4 relevant toolchain IDs from the following options: 'firebase', 'nextjs', 'python', 'nodejs', 'docker', 'azure-ml', 'github-actions'.
    2.  **dependencies**: Suggest a list of key libraries or dependencies.
    3.  **securityControls**: Recommend 2-3 important security controls to implement during development.
    4.  **testApproach**: Outline a suitable testing approach, covering unit, integration, and performance tests.

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
