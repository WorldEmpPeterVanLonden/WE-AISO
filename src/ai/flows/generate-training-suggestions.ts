
'use server';

/**
 * @fileOverview AI flow to generate suggestions for the Training phase of a project.
 *
 * - generateTrainingSuggestions - A function that generates suggestions for training details.
 */

import { ai } from '@/ai/genkit';
import { 
    TrainingSuggestionsInputSchema, 
    TrainingSuggestionsOutputSchema, 
    type TrainingSuggestionsInput, 
    type TrainingSuggestionsOutput 
} from '@/ai/schemas/training-suggestions';

export async function generateTrainingSuggestions(input: TrainingSuggestionsInput): Promise<TrainingSuggestionsOutput> {
  const prompt = ai.definePrompt({
    name: 'trainingSuggestionsPrompt',
    input: { schema: TrainingSuggestionsInputSchema },
    output: { schema: TrainingSuggestionsOutputSchema },
    prompt: `You are an expert AI/ML Researcher. Based on the project use case provided, generate detailed suggestions for the training phase of an AI system.

    Use Case: {{{useCase}}}

    Generate clear, concise, and actionable suggestions for the following fields. Use bullet points for lists where appropriate.

    1.  **datasetDescription**: Briefly describe a suitable type of dataset for training.
    2.  **datasetSources**: Suggest potential sources for acquiring this dataset.
    3.  **biasAssessment**: Describe a common bias to look for in this context and a method to assess it.
    4.  **privacyAssessment**: Recommend a key privacy consideration and a technique to address it.
    5.  **trainingProcedure**: Briefly outline a typical training procedure for this type of model.

    Provide the output in the requested JSON format.
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
