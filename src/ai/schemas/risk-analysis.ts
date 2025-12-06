
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
  dataType: z.string().describe('The type of data used by the AI system (e.g., user queries, medical images).'),
  modelType: z.string().describe('The type of model used (LLM, ML, rule-based, hybrid).'),
  userGroup: z.string().describe('The group of users affected by the AI system (e.g., general public, doctors).'),
});
export type RiskAnalysisInput = z.infer<typeof RiskAnalysisInputSchema>;

const riskSchema = z.object({
  riskType: z.string().describe('The type of risk (e.g., Privacy, Hallucination, Bias, Misuse, Robustness, Security, Legal).'),
  riskLevel: z.string().describe('The assessed level of risk (low, medium, high).'),
  mitigations: z.array(z.string()).describe('A list of 2-3 concrete, recommended mitigations for the risk.'),
  iso42001Controls: z.array(z.string()).describe('A list of 2-3 relevant ISO 42001 Annex A control IDs (e.g., "A.5.1", "A.7.4").'),
});

export const RiskAnalysisOutputSchema = z.object({
  risks: z.array(riskSchema).describe('A list of identified risks associated with the AI system, covering at least 5 different risk types.'),
});
export type RiskAnalysisOutput = z.infer<typeof RiskAnalysisOutputSchema>;
