/**
 * @fileOverview Zod schemas for the validation suggestions flow.
 */

import { z } from 'zod';

export const ValidationSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type ValidationSuggestionsInput = z.infer<typeof ValidationSuggestionsInputSchema>;

export const ValidationSuggestionsOutputSchema = z.object({
    acceptanceCriteria: z.string().describe("Suggested acceptance criteria with metrics."),
    robustnessTests: z.string().describe("A suggested robustness test."),
    edgeCaseTests: z.string().describe("A suggested edge case test."),
    validationResults: z.string().describe("A template for summarizing validation results."),
});
export type ValidationSuggestionsOutput = z.infer<typeof ValidationSuggestionsOutputSchema>;
