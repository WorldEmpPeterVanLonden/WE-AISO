'use client';

/**
 * @fileOverview Zod schemas for the basic info suggestions flow.
 */

import { z } from 'zod';

export const BasicInfoSuggestionsInputSchema = z.object({
  projectName: z.string().describe('The name of the AI project.'),
  useCase: z.string().describe('The primary use case of the AI system.'),
  intendedUsers: z.string().describe('The intended users of the system.'),
  geographicScope: z.string().describe('The geographic scope where the system will be used (e.g., EU, USA, Global).'),
});
export type BasicInfoSuggestionsInput = z.infer<typeof BasicInfoSuggestionsInputSchema>;

export const BasicInfoSuggestionsOutputSchema = z.object({
    businessContext: z.string().describe("A suggested business context for the project."),
    legalRequirements: z.string().describe("A suggestion for applicable legal requirements (e.g., GDPR, AI Act)."),
    dataCategories: z.array(z.string()).describe("A list of suggested data categories that might be processed."),
});
export type BasicInfoSuggestionsOutput = z.infer<typeof BasicInfoSuggestionsOutputSchema>;
