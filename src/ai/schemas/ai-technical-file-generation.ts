'use client';

/**
 * @fileOverview Zod schemas for the AI Technical File Generation flow.
 */

import { z } from 'zod';

export const GenerateAiTechnicalFileInputSchema = z.object({
  systemDefinition: z.string().describe('AI System Definition Sheet content.'),
  lifecycleOverview: z.string().describe('Lifecycle Overview & Control Sheet content.'),
  riskAnalysis: z.string().describe('AI Risk Register content.'),
  controls: z.string().describe('Control Implementation Sheet content.'),
  designChoices: z.string().describe('Design choices overview.'),
  infrastructureDiagram: z.string().describe('Infrastructure diagram description.'),
  testOverview: z.string().describe('Test overview summary.'),
  datasetSummary: z.string().describe('Dataset summary.'),
  format: z.enum(['pdf', 'word']).describe('The desired output format (PDF or Word).'),
});
export type GenerateAiTechnicalFileInput = z.infer<typeof GenerateAiTechnicalFileInputSchema>;

export const GenerateAiTechnicalFileOutputSchema = z.object({
  technicalFile: z.string().describe('The generated AI Lifecycle Technical File content.'),
});
export type GenerateAiTechnicalFileOutput = z.infer<typeof GenerateAiTechnicalFileOutputSchema>;

export const GenerateDocumentSchema = z.object({
  projectId: z.string(),
  documentType: z.enum(["technicalFile", "riskReport", "fullLifecycle", "custom"]),
  version: z.string().min(1, "Version is required"),
  format: z.enum(["pdf", "word"]),
});
export type GenerateDocumentFormData = z.infer<typeof GenerateDocumentSchema>;
