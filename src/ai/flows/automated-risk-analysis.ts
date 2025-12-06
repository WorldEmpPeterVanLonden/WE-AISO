
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
  prompt: `You are an AI risk assessment expert specializing in ISO 42001 and the EU AI Act. 
  
  Analyze the potential risks associated with the described AI system.
  
  System Information:
  - Use Case: {{{useCase}}}
  - Data Type: {{{dataType}}}
  - Model Type: {{{modelType}}}
  - Affected User Group: {{{userGroup}}}

  Your task is to identify a comprehensive list of at least 5 distinct risks from different categories (e.g., Privacy, Bias, Security, Accuracy, Misuse, Robustness, Legal). For each identified risk, you must provide:
  1.  **riskType**: The specific category of the risk.
  2.  **riskLevel**: An estimated risk level ('low', 'medium', or 'high') based on the potential impact and likelihood for the given system.
  3.  **mitigations**: A list of 2-3 concrete and actionable mitigation strategies.
  4.  **iso42001Controls**: A list of 2-3 relevant ISO 42001 Annex A control IDs that map to the risk and mitigations (e.g., "A.5.1", "A.7.4").

  Structure the output as the requested JSON object.
  `,
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
