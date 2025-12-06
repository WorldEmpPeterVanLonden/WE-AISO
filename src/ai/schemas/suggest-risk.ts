
'use client';

import { z } from 'zod';

export const SuggestRiskInputSchema = z.object({
  useCase: z.string().describe("The primary use case of the AI system."),
  dataCategories: z.array(z.string()).describe("The categories of data the system processes."),
  riskTitle: z.string().optional().describe("An optional title or keyword for a specific risk to focus on."),
});
export type SuggestRiskInput = z.infer<typeof SuggestRiskInputSchema>;

export const SuggestRiskOutputSchema = z.object({
  description: z.string().describe("A detailed description of the identified risk."),
  category: z.enum([
    "privacy",
    "bias",
    "security",
    "accuracy",
    "misuse",
    "robustness",
    "legal",
  ]).describe("The most appropriate category for the risk."),
  likelihood: z.number().min(1).max(5).describe("An estimated likelihood of the risk occurring (1-5)."),
  impact: z.number().min(1).max(5).describe("An estimated impact if the risk occurs (1-5)."),
  mitigations: z.array(z.string()).describe("A list of 2-3 concrete mitigation strategies."),
  isoControls: z.array(z.string()).describe("A list of 2-3 relevant ISO 42001 Annex A control IDs."),
});
export type SuggestRiskOutput = z.infer<typeof SuggestRiskOutputSchema>;
