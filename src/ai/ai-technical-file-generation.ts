'use server';

/**
 * @fileOverview AI Technical File Generation flow, compliant with ISO 42001 standards.
 *
 * - generateAiTechnicalFile - A function that generates the AI Technical File.
 */

import {ai} from '@/ai/genkit';
import { 
    GenerateAiTechnicalFileInputSchema, 
    GenerateAiTechnicalFileOutputSchema,
    type GenerateAiTechnicalFileInput,
    type GenerateAiTechnicalFileOutput
} from '@/ai/schemas/ai-technical-file-generation';


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
