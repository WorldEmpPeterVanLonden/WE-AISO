'use server';

/**
 * @fileOverview AI flow to generate suggestions for the main project details.
 *
 * - generateProjectSuggestions - A function that generates suggestions for the project name and description based on the use case.
 */

import { ai } from '@/ai/genkit';
import { 
    ProjectSuggestionsInputSchema, 
    ProjectSuggestionsOutputSchema, 
    type ProjectSuggestionsInput, 
    type ProjectSuggestionsOutput 
} from '@/ai/schemas/project-suggestions';

export async function generateProjectSuggestions(input: ProjectSuggestionsInput): Promise<ProjectSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'projectSuggestionsPrompt',
    input: { schema: ProjectSuggestionsInputSchema },
    output: { schema: ProjectSuggestionsOutputSchema },
    prompt: `You are an expert project manager for AI systems. Based on the provided use case, generate a concise and descriptive project name and a brief, one-sentence project description.

    Use Case: {{{useCase}}}
    
    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
