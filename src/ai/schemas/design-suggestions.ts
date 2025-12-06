'use client';

/**
 * @fileOverview Zod schemas for the design suggestions flow.
 */

import { z } from 'zod';

export const DesignSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type DesignSuggestionsInput = z.infer<typeof DesignSuggestionsInputSchema>;

export const DesignSuggestionsOutputSchema = z.object({
    functionalRequirements: z.string().describe("Suggested functional requirements."),
    nonFunctionalRequirements: z.string().describe("Suggested non-functional requirements."),
    designChoices: z.string().describe("Suggested design choices."),
    dataArchitecture: z.string().describe("Suggested data architecture."),
    explainabilityStrategy: z.string().describe("Suggested explainability strategy."),
});
export type DesignSuggestionsOutput = z.infer<typeof DesignSuggestionsOutputSchema>;
