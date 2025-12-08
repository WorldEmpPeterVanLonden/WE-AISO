/**
 * @fileOverview Zod schemas for the development suggestions flow.
 */

import { z } from 'zod';

export const DevelopmentSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type DevelopmentSuggestionsInput = z.infer<typeof DevelopmentSuggestionsInputSchema>;

export const DevelopmentSuggestionsOutputSchema = z.object({
    toolchain: z.array(z.string()).describe("A list of suggested toolchain item IDs."),
    dependencies: z.string().describe("Suggested dependencies, formatted as a bulleted list."),
    securityControls: z.string().describe("Suggested security controls, formatted as a bulleted list."),
    testApproach: z.string().describe("A suggested test approach."),
});
export type DevelopmentSuggestionsOutput = z.infer<typeof DevelopmentSuggestionsOutputSchema>;
