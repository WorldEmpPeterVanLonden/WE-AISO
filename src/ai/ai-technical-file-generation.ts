'use server';

/**
 * @fileOverview AI Technical File Generation flow, compliant with ISO 42001 standards.
 *
 * - generateAiTechnicalFile - A function that generates the AI Technical File.
 * - GenerateAiTechnicalFileInput - The input type for the generateAiTechnicalFile function.
 * - GenerateAiTechnicalFileOutput - The return type for the generateAiTechnicalFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const GenerateAiTechnicalFileOutputSchema = z.object({
  technicalFile: z.string().describe('The generated AI Lifecycle Technical File content.'),
});
export type GenerateAiTechnicalFileOutput = z.infer<typeof GenerateAiTechnicalFileOutputSchema>;

export async function generateAiTechnicalFile(input: GenerateAiTechnicalFileInput): Promise<GenerateAiTechnicalFileOutput> {
  return generateAiTechnicalFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiTechnicalFilePrompt',
  input: {schema: GenerateAiTechnicalFileInputSchema},
  output: {schema: GenerateAiTechnicalFileOutputSchema},
  prompt: `You are an expert AI compliance engineer specialized in ISO 42001.
  Your task is to generate a comprehensive AI Lifecycle Technical File based on the provided information.
  The file should be in a structured format, suitable for PDF or Word export, and compliant with ISO 42001 standards.

  System Definition: {{{systemDefinition}}}
  Lifecycle Overview: {{{lifecycleOverview}}}
  Risk Analysis: {{{riskAnalysis}}}
  Controls: {{{controls}}}
  Design Choices: {{{designChoices}}}
  Infrastructure Diagram: {{{infrastructureDiagram}}}
  Test Overview: {{{testOverview}}}
  Dataset Summary: {{{datasetSummary}}}

  Based on the information above, create a complete AI Technical File according to ISO 42001 requirements.
  Consider all aspects of the AI lifecycle, including design, development, training, validation, deployment, operation, and retirement.
  Make sure all sections are well-structured and easy to understand.

  Output format: {{{format}}}
  `,
});

const generateAiTechnicalFileFlow = ai.defineFlow(
  {
    name: 'generateAiTechnicalFileFlow',
    inputSchema: GenerateAiTechnicalFileInputSchema,
    outputSchema: GenerateAiTechnicalFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
