'use client';

/**
 * @fileOverview Zod schemas for the project suggestions flow.
 */

import { z } from 'zod';

export const ProjectSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type ProjectSuggestionsInput = z.infer<typeof ProjectSuggestionsInputSchema>;

export const ProjectSuggestionsOutputSchema = z.object({
    name: z.string().describe("A suggested, concise name for the project."),
    description: z.string().describe("A suggested, brief description for the project."),
});
export type ProjectSuggestionsOutput = z.infer<typeof ProjectSuggestionsOutputSchema>;
