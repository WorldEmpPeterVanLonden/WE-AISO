/**
 * @fileOverview Zod schemas for the design suggestions flow.
 */

import { z } from 'zod';

export const DesignSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type DesignSuggestionsInput = z.infer<typeof DesignSuggestionsInputSchema>;

export const DesignSuggestionsOutputSchema = z.object({
    functionalRequirements: z.string().describe("Suggested functional requirements, formatted as a bulleted list."),
    nonFunctionalRequirements: z.string().describe("Suggested non-functional requirements (e.g. performance, security, availability), formatted as a bulleted list."),
    designChoices: z.string().describe("Suggested high-level design choices (e.g. model type, key libraries, architecture patterns), formatted as a bulleted list."),
    dataArchitecture: z.string().describe("Suggested data architecture, describing how data will be ingested, processed, and stored."),
    explainabilityStrategy: z.array(z.string()).describe("A list of suggested explainability strategy IDs (e.g., 'model-card', 'shap', 'lime')."),
});
export type DesignSuggestionsOutput = z.infer<typeof DesignSuggestionsOutputSchema>;
