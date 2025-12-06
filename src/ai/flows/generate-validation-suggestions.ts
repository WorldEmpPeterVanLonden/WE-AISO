
'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Validation phase of a project.
 *
 * - generateValidationSuggestions - A function that generates suggestions for validation details.
 */

import { ai } from '@/ai/genkit';
import { 
    ValidationSuggestionsInputSchema, 
    ValidationSuggestionsOutputSchema, 
    type ValidationSuggestionsInput, 
    type ValidationSuggestionsOutput 
} from '@/ai/schemas/validation-suggestions';

export async function generateValidationSuggestions(input: ValidationSuggestionsInput): Promise<ValidationSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'validationSuggestionsPrompt',
    input: { schema: ValidationSuggestionsInputSchema },
    output: { schema: ValidationSuggestionsOutputSchema },
    prompt: `You are an expert AI Quality Assurance Engineer. Based on the project use case provided, generate detailed suggestions for the validation phase of an AI system.

    Use Case: {{{useCase}}}

    Generate clear, concise, and actionable suggestions for the following fields. Use bullet points for lists where appropriate.

    1.  **acceptanceCriteria**: Define 2-3 key acceptance criteria with specific, measurable targets (e.g., "Accuracy > 95%").
    2.  **robustnessTests**: Suggest a relevant robustness test to perform.
    3.  **edgeCaseTests**: Describe a plausible edge case that should be tested.
    4.  **validationResults**: Write a template sentence for summarizing validation results, leaving placeholders for metrics.

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
