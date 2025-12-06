
'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Design phase of a project.
 *
 * - generateDesignSuggestions - A function that generates suggestions for design requirements.
 */

import { ai } from '@/ai/genkit';
import { 
    DesignSuggestionsInputSchema, 
    DesignSuggestionsOutputSchema, 
    type DesignSuggestionsInput, 
    type DesignSuggestionsOutput 
} from '@/ai/schemas/design-suggestions';

export async function generateDesignSuggestions(input: DesignSuggestionsInput): Promise<DesignSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'designSuggestionsPrompt',
    input: { schema: DesignSuggestionsInputSchema },
    output: { schema: DesignSuggestionsOutputSchema },
    prompt: `You are an expert AI System Architect. Based on the project use case provided, generate detailed suggestions for the design phase of an AI system.

    Use Case: {{{useCase}}}

    Generate clear, concise, and actionable suggestions for the following fields. Use bullet points for lists.

    1.  **Functional Requirements**: What are the 3-5 most critical functions the system must perform to fulfill the use case?
    2.  **Non-Functional Requirements**: What are the 3-5 most important non-functional requirements (e.g., latency, throughput, security, availability, privacy)? Be specific.
    3.  **Design Choices**: Recommend high-level design decisions. Include suggestions for model type (e.g., fine-tuned foundation model, RAG), potential libraries or frameworks (e.g., LangChain, PyTorch), and key architectural patterns (e.g., microservices, serverless).
    4.  **Data Architecture**: Briefly describe a suitable data architecture. How will data be ingested, processed (e.g., ETL pipelines, vectorization), and stored (e.g., vector database, document store)?
    5.  **Explainability Strategy**: Based on the use case, suggest a list of 2-3 relevant explainability strategy IDs from the following options: 'model-card', 'shap', 'lime', 'feature-importance', 'human-in-the-loop', 'not-applicable'.

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
