// ./src/ai/genkit.ts
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId: process.env.VERTEX_PROJECT!,
      location: process.env.VERTEX_LOCATION!,
    }),
  ],
});
