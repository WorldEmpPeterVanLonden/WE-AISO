'use server';

/**
 * @fileOverview An AI agent to automatically assess risks associated with an AI system and suggest mitigations.
 *
 * - analyzeRisk - A function that handles the risk analysis process.
 */

import {ai} from '@/ai/genkit';
import {RiskAnalysisInputSchema, RiskAnalysisOutputSchema, type RiskAnalysisInput, type RiskAnalysisOutput} from '@/ai/schemas/risk-analysis';


export async function analyzeRisk(input: RiskAnalysisInput): Promise<RiskAnalysisOutput> {
  return analyzeRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskAnalysisPrompt',
  input: {schema: RiskAnalysisInputSchema},
  output: {schema: RiskAnalysisOutputSchema},
  prompt: `You are an AI risk assessment expert. Analyze the risks associated with the AI system based on the following information:\n\nUse Case: {{{useCase}}}\nData Type: {{{dataType}}}\nModel Type: {{{modelType}}}\nUser Group: {{{userGroup}}}\n\nIdentify potential risks (privacy, hallucination, bias, misuse, robustness), their risk levels (low, medium, high), recommended mitigations, and mapping to ISO 42001 controls.  Structure the output as a JSON array of risk objects.`,
});

const analyzeRiskFlow = ai.defineFlow(
  {
    name: 'analyzeRiskFlow',
    inputSchema: RiskAnalysisInputSchema,
    outputSchema: RiskAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
