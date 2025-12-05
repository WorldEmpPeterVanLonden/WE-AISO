import {z} from 'zod';

/**
 * @fileOverview Zod schemas for the automated risk analysis flow.
 *
 * - RiskAnalysisInputSchema - The Zod schema for the input of the analyzeRisk function.
 * - RiskAnalysisInput - The Typescript type for the input of the analyzeRisk function.
 * - RiskAnalysisOutputSchema - The Zod schema for the output of the analyzeRisk function.
 * - RiskAnalysisOutput - The Typescript type for the output of the analyzeRisk function.
 */

export const RiskAnalysisInputSchema = z.object({
  useCase: z.string().describe('The use case of the AI system.'),
  dataType: z.string().describe('The type of data used by the AI system.'),
  modelType: z.string().describe('The type of model used (LLM, ML, rule-based, hybrid).'),
  userGroup: z.string().describe('The group of users affected by the AI system.'),
});
export type RiskAnalysisInput = z.infer<typeof RiskAnalysisInputSchema>;

export const RiskAnalysisOutputSchema = z.object({
  risks: z.array(
    z.object({
      riskType: z.string().describe('The type of risk (privacy, hallucination, bias, misuse, robustness).'),
      riskLevel: z.string().describe('The level of risk (low, medium, high).'),
      mitigations: z.array(z.string()).describe('Recommended mitigations for the risk.'),
      iso27001Controls: z.array(z.string()).describe('Mapping to ISO 42001 controls.'),
    })
  ).describe('A list of risks associated with the AI system.'),
});
export type RiskAnalysisOutput = z.infer<typeof RiskAnalysisOutputSchema>;
