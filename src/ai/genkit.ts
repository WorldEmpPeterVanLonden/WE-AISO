import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [
    vertexAI({ location: 'us-central1' }), // Regional endpoint
    // vertexAI({ location: 'global' }),      // Global endpoint
  ],
});