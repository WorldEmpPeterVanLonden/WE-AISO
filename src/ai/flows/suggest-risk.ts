
'use server';

/**
 * @fileOverview AI flow to suggest details for a specific risk in the risk register.
 *
 * - suggestRisk - A function that generates a detailed risk profile.
 */

import { ai } from '@/ai/genkit';
import { 
    SuggestRiskInputSchema, 
    SuggestRiskOutputSchema, 
    type SuggestRiskInput, 
    type SuggestRiskOutput 
} from '@/ai/schemas/suggest-risk';

export async function suggestRisk(input: SuggestRiskInput): Promise<SuggestRiskOutput> {
  const prompt = ai.definePrompt({
    name: 'suggestRiskPrompt',
    input: { schema: SuggestRiskInputSchema },
    output: { schema: SuggestRiskOutputSchema },
    prompt: `You are an AI risk assessment expert. Based on the provided project context, generate a detailed profile for a potential risk.

    Project Context:
    - Use Case: {{{useCase}}}
    - Data Categories: {{#each dataCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

    {{#if riskTitle}}
    Focus on a risk related to: **{{{riskTitle}}}**
    {{else}}
    Identify a single, plausible, and significant risk based on the context.
    {{/if}}

    For the identified risk, provide the following details:
    1.  **description**: A clear and detailed description of the risk scenario.
    2.  **category**: The most fitting risk category from the available options.
    3.  **likelihood**: An estimated likelihood score from 1 (Very Low) to 5 (Very High).
    4.  **impact**: An estimated impact score from 1 (Very Low) to 5 (Very High).
    5.  **mitigations**: A list of 2-3 concrete, actionable mitigation strategies.
    6.  **isoControls**: A list of 2-3 relevant ISO 42001 Annex A control IDs (e.g., "A.5.1", "A.7.4").

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
