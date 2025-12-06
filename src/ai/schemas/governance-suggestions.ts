'use client';

/**
 * @fileOverview Zod schemas for the governance suggestions flow.
 */

import { z } from 'zod';

export const GovernanceSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type GovernanceSuggestionsInput = z.infer<typeof GovernanceSuggestionsInputSchema>;

export const GovernanceSuggestionsOutputSchema = z.object({
    suggestedControls: z.array(z.string()).describe("A list of suggested ISO 42001 controls relevant to the use case (e.g., 'A.5.1 Data quality')."),
});
export type GovernanceSuggestionsOutput = z.infer<typeof GovernanceSuggestionsOutputSchema>;
