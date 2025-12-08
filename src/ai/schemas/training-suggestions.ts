/**
 * @fileOverview Zod schemas for the training suggestions flow.
 */

import { z } from 'zod';

export const TrainingSuggestionsInputSchema = z.object({
  useCase: z.string().describe('The primary use case of the AI system.'),
});
export type TrainingSuggestionsInput = z.infer<typeof TrainingSuggestionsInputSchema>;

export const TrainingSuggestionsOutputSchema = z.object({
    datasetDescription: z.string().describe("A brief description of a suitable dataset."),
    datasetSources: z.string().describe("Suggested sources for the dataset."),
    biasAssessment: z.string().describe("A suggestion for a bias assessment approach."),
    privacyAssessment: z.string().describe("A suggestion for a privacy assessment approach."),
    trainingProcedure: z.string().describe("A brief outline of a training procedure."),
});
export type TrainingSuggestionsOutput = z.infer<typeof TrainingSuggestionsOutputSchema>;
